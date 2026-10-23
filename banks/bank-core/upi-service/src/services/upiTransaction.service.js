import upiTransactionRepository from "../repositories/upiTransaction.repository.js";
import vpaRepository from "../repositories/vpa.repository.js";
import vpaService from "./vpa.service.js";
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
            throw new AppError("Only successful transactions can be refunded", 400);
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
        const refund = await upiTransactionRepository.create({
            rrn,
            txnRef: randomUUID(),
            type: "REFUND",
            status: "INITIATED",
            senderVpaId: original.receiverVpaId,    // original receiver refunds
            receiverVpaId: original.senderVpaId,    // back to original sender
            senderAccountId: original.receiverAccountId,
            receiverAccountId: original.senderAccountId,
            amount: refundAmount,
            currency: original.currency,
            description: `Refund for ${original.txnRef}`,
            remarks,
        });
        // TODO: Call bank gRPC to reverse the funds
        const completed = await upiTransactionRepository.markSuccess(refund.id, null, null);
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
