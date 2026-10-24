import upiTransactionRepository from "../repositories/upiTransaction.repository.js";
import vpaRepository from "../repositories/vpa.repository.js";
import vpaService from "./vpa.service.js";
import { debitAccount, creditAccount } from "../grpc/clients/accountClient.js";
import AppError from "../errors/AppError.js";
import { randomUUID } from "crypto";

// Generate a unique 12-digit RRN (Retrieval Reference Number)
// Real NPCI RRN is assigned by the switch — this is for local dev
function generateRrn() {
    const ts = Date.now().toString().slice(-9);
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return ts + rand;
}

class UpiTransactionService {

    // INITIATE PAY (Push Payment)
    // Validates PIN, debits sender, credits receiver

    async initiatePay(data, ipAddress, userAgent) {
        const { senderVpa, receiverVpa, amount, currency, description, remarks, upiPin } = data;

        // 1. Resolve VPA addresses → DB records
        const sender = await vpaRepository.findByVpa(senderVpa);
        if (!sender) {
            throw new AppError(`Sender VPA '${senderVpa}' not found`, 404);
        }

        const receiver = await vpaRepository.findByVpa(receiverVpa);
        if (!receiver) {
            throw new AppError(`Receiver VPA '${receiverVpa}' not found`, 404);
        }

        // 2. Validate both VPAs are ACTIVE
        if (sender.status !== "ACTIVE") {
            throw new AppError(`Sender VPA is ${sender.status}`, 400);
        }
        if (receiver.status !== "ACTIVE") {
            throw new AppError(`Receiver VPA is ${receiver.status}`, 400);
        }

        // 3. Verify UPI PIN (throws on failure / lockout)
        await vpaService.verifyPin(sender.id, upiPin, ipAddress, userAgent);

        // 4. Generate unique references
        let rrn = generateRrn();
        while (await upiTransactionRepository.rrnExists(rrn)) {
            rrn = generateRrn();
        }

        const txnRef = randomUUID();

        // 5. Create transaction record (INITIATED)
        const transaction = await upiTransactionRepository.create({
            rrn,
            txnRef,
            type: "PAY",
            status: "INITIATED",
            senderVpaId: sender.id,
            receiverVpaId: receiver.id,
            senderAccountId: sender.accountId,
            receiverAccountId: receiver.accountId,
            amount,
            currency: currency || "INR",
            description,
            remarks,
        });

        // 6. Forward payment to NPCI Switch
        try {
            const switchServiceUrl = process.env.NPCI_SWITCH_URL || "http://localhost:5010";
            const response = await fetch(`${switchServiceUrl}/api/v1/switch/pay`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    txnRef,
                    type: "PAY",
                    senderVpa,
                    receiverVpa,
                    amount: amount.toString(),
                    currency: currency || "INR",
                    description,
                    remarks,
                    senderPsp: sender.bankCode,
                    receiverPsp: receiver.bankCode,
                }),
            });

            const switchResult = await response.json();

            if (!response.ok || !switchResult.success) {
                const errorMsg = switchResult.message || `NPCI Switch payment failed (HTTP ${response.status})`;
                await upiTransactionRepository.markFailed(transaction.id, errorMsg);
                throw new AppError(errorMsg, response.status >= 400 && response.status < 500 ? response.status : 502);
            }

            // 7. Mark transaction SUCCESS with NPCI references
            const completed = await upiTransactionRepository.markSuccess(
                transaction.id,
                switchResult.data?.rrn || rrn,
                switchResult.data?.npciTxnId || null
            );

            // 8. Record history in transaction-service (+ ledger entries).
            // Money has already moved at NPCI, so failures here are logged
            // but must not fail the payment.
            try {
                const txnServiceUrl = process.env.TRANSACTION_SERVICE_URL || "http://localhost:5003";
                const recordRes = await fetch(`${txnServiceUrl}/transactions/record`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        reference: `UPI-${rrn}`,
                        sourceAccountId: sender.accountId,
                        destinationAccountId: receiver.accountId,
                        amount: amount.toString(),
                        currency: currency || "INR",
                        description: description || `UPI payment ${senderVpa} → ${receiverVpa}`,
                    }),
                });

                if (!recordRes.ok) {
                    const errBody = await recordRes.json().catch(() => ({}));
                    console.error("❌ Failed to record transaction/ledger:", errBody.message || recordRes.statusText);
                }
            } catch (recordErr) {
                console.error("❌ Could not reach transaction-service:", recordErr.message);
            }

            return {
                ...completed,
                switchTransaction: switchResult.data,
            };
        } catch (err) {
            if (err instanceof AppError) throw err;
            await upiTransactionRepository.markFailed(transaction.id, err.message);
            throw new AppError(`Switch payment failed: ${err.message}`, 502);
        }

    }

    // GET TRANSACTION BY ID
    async getTransactionById(id) {
        const txn = await upiTransactionRepository.findById(id);
        if (!txn) {
            throw new AppError("Transaction not found", 404);
        }
        return txn;
    }

    // GET TRANSACTION BY RRN
    async getTransactionByRrn(rrn) {
        const txn = await upiTransactionRepository.findByRrn(rrn);
        if (!txn) {
            throw new AppError(`Transaction with RRN '${rrn}' not found`, 404);
        }
        return txn;
    }

    // GET ALL TRANSACTIONS FOR A VPA (sent + received)
    async getTransactionsByVpaId(vpaId) {
        const vpa = await vpaRepository.findById(vpaId);
        if (!vpa) {
            throw new AppError("VPA not found", 404);
        }
        return await upiTransactionRepository.findByVpaId(vpaId);
    }

    // GET ALL TRANSACTIONS
    async getAllTransactions() {
        return await upiTransactionRepository.findAll();
    }

    // INITIATE REFUND
    async initiateRefund(data) {
        const { originalTransactionId, amount, remarks } = data;
        const original = await upiTransactionRepository.findById(originalTransactionId);
        if (!original) {
            throw new AppError("Original transaction not found", 404);
        }
        if (original.status !== "SUCCESS") {
            throw new AppError(`Only successful transactions can be refunded. Current status is ${original.status}`, 400);
        }
        const refundAmount = amount ?? Number(original.amount);
        if (refundAmount > Number(original.amount)) {
            throw new AppError("Refund amount cannot exceed original transaction amount", 400);
        }

        // Swap sender/receiver for refund
        let rrn = generateRrn();
        while (await upiTransactionRepository.rrnExists(rrn)) {
            rrn = generateRrn();
        }

        const txnRef = randomUUID();
        const refund = await upiTransactionRepository.create({
            rrn,
            txnRef,
            type: "REFUND",
            status: "INITIATED",
            senderVpaId: original.receiverVpaId,    // original receiver refunds
            receiverVpaId: original.senderVpaId,    // back to original sender
            senderAccountId: original.receiverAccountId,
            receiverAccountId: original.senderAccountId,
            amount: refundAmount,
            currency: original.currency,
            description: remarks || `Refund for ${original.txnRef}`,
            remarks,
        });

        const refTag = `UPI-REF-${rrn}`;

        // 1. Call bank gRPC to reverse the funds
        // Step A: Debit the original receiver (undo previous credit)
        try {
            const debitRes = await debitAccount(
                original.receiverAccountId,
                refundAmount.toString(),
                refTag
            );
            if (!debitRes.success) {
                await upiTransactionRepository.markFailed(refund.id, `Receiver debit failed: ${debitRes.message}`);
                throw new AppError(`Refund debit failed: ${debitRes.message}`, 400);
            }
        } catch (err) {
            if (err instanceof AppError) throw err;
            await upiTransactionRepository.markFailed(refund.id, err.message);
            throw new AppError(`Refund debit error: ${err.message}`, 502);
        }

        // Step B: Credit the original sender (undo previous debit)
        try {
            const creditRes = await creditAccount(
                original.senderAccountId,
                refundAmount.toString(),
                refTag
            );
            if (!creditRes.success) {
                // Critical — receiver debited but sender credit failed
                await upiTransactionRepository.markFailed(refund.id, `Sender credit failed: ${creditRes.message}`);
                throw new AppError(`Refund credit failed: ${creditRes.message}. Manual intervention required.`, 502);
            }
        } catch (err) {
            if (err instanceof AppError) throw err;
            await upiTransactionRepository.markFailed(refund.id, err.message);
            throw new AppError(`Refund credit error: ${err.message}`, 502);
        }

        // 2. Mark refund as SUCCESS & original transaction as REVERSED
        const completed = await upiTransactionRepository.markSuccess(refund.id, rrn, null);
        await upiTransactionRepository.updateStatus(original.id, "REVERSED");

        // 3. Record history in transaction-service (+ double-entry ledger entries)
        try {
            const txnServiceUrl = process.env.TRANSACTION_SERVICE_URL || "http://localhost:5003";
            const recordRes = await fetch(`${txnServiceUrl}/transactions/record`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reference: refTag,
                    sourceAccountId: original.receiverAccountId,      // debited
                    destinationAccountId: original.senderAccountId,  // credited
                    amount: refundAmount.toString(),
                    currency: original.currency || "INR",
                    description: remarks || `UPI refund for ${original.txnRef}`,
                    type: "REFUND",
                }),
            });

            if (!recordRes.ok) {
                const errBody = await recordRes.json().catch(() => ({}));
                console.error("❌ Failed to record refund in transaction/ledger:", errBody.message || recordRes.statusText);
            }
        } catch (recordErr) {
            console.error("❌ Could not reach transaction-service for refund:", recordErr.message);
        }

        return completed;
    }

    // MARK FAILED (called by bank gRPC callback)
    async markFailed(id, failureReason) {
        const txn = await upiTransactionRepository.findById(id);
        if (!txn) {
            throw new AppError("Transaction not found", 404);
        }
        return await upiTransactionRepository.markFailed(id, failureReason);
    }
}

export default new UpiTransactionService();
