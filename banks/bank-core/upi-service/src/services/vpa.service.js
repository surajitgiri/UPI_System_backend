import vpaRepository from "../repositories/vpa.repository.js";
import pinAttemptRepository from "../repositories/pinAttempt.repository.js";
import AppError from "../errors/AppError.js";
import bcrypt from "bcrypt";
import { getCustomerById } from "../grpc/clients/customerClient.js";
import { getAccountById, validateAccount } from "../grpc/clients/accountClient.js";

const PIN_BCRYPT_ROUNDS = 12;
const MAX_FAILED_PIN_ATTEMPTS = 3;
const LOCKOUT_WINDOW_MINUTES = 30

class VpaService {
    // Create VPA
    async createVpa(data) {
        const { vpa, userId, accountId, bankCode, isPrimary, isDefault, remarks } = data;

        // ── 1. Validate userId exists in customer-service via gRPC ──────
        try {
            const customerRes = await getCustomerById(userId);
            if (!customerRes.success || !customerRes.data) {
                throw new AppError(`Customer with userId '${userId}' not found`, 404);
            }
        } catch (err) {
            if (err instanceof AppError) throw err;
            throw new AppError(
                `Could not verify customer. Is customer-service running? (${err.message})`,
                503
            );
        }

        // ── 2. Validate accountId exists + is ACTIVE in account-service ─
        try {
            const accountRes = await getAccountById(accountId);
            if (!accountRes.success || !accountRes.data) {
                throw new AppError(`Account with id '${accountId}' not found`, 404);
            }

            const account = accountRes.data;

            if (account.status !== "ACTIVE") {
                throw new AppError(
                    `Account is ${account.status}. Only ACTIVE accounts can be linked to a VPA.`,
                    400
                );
            }

            // Ensure userId matches the account's customerId (ownership check)
            if (account.customerId !== userId) {
                throw new AppError(
                    "Account does not belong to this customer",
                    403
                );
            }
        } catch (err) {
            if (err instanceof AppError) throw err;
            throw new AppError(
                `Could not verify account. Is account-service running? (${err.message})`,
                503
            );
        }

        // ── 3. Check VPA uniqueness ─────────────────────────────────────
        const alreadyExists = await vpaRepository.vpaExists(vpa);
        if (alreadyExists) {
            throw new AppError(`VPA '${vpa}' is already registered`, 409);
        }

        // ── 4. Derive handle from VPA (suraj@okicici → okicici) ─────────
        const handle = vpa.split("@")[1];

        // ── 5. Auto-set primary & default if first VPA for this user ────
        const existingCount = await vpaRepository.countByUserId(userId);
        const shouldBePrimary = isPrimary || existingCount === 0;
        const shouldBeDefault = isDefault || existingCount === 0;

        return await vpaRepository.create({
            vpa,
            handle,
            userId,
            accountId,
            bankCode,
            isPrimary: shouldBePrimary,
            isDefault: shouldBeDefault,
            remarks,
        });
    }

    //GET ALL VPAs
    async getAllVpas() {
        return await vpaRepository.findAll();
    }

    // GET VPA BY ID
    async getVpaById(id) {
        const vpa = await vpaRepository.findById(id);
        if (!vpa) {
            throw new AppError("VPA not found", 404);
        }
        return vpa;
    }

    // GET VPA BY ADDRESS (e.g. suraj@okicici)
    async getVpaByAddress(address) {
        const vpa = await vpaRepository.findByVpa(address);
        if (!vpa) {
            throw new AppError(`VPA '${address}' not found`, 404);
        }
        return vpa;
    }

    // GET ALL VPAs FOR A USER
    async getVpasByUserId(userId) {
        return await vpaRepository.findByUserId(userId);
    }

    // UPDATE VPA
    async updateVpa(id, data) {
        const vpa = await vpaRepository.findById(id);
        if (!vpa) {
            throw new AppError("VPA not found", 404);
        }
        if (vpa.status === "DELETED") {
            throw new AppError("Cannot update a deleted VPA", 400);
        }
        return await vpaRepository.update(id, data);
    }

    // SUSPEND VPA
    async suspendVpa(id) {
        const vpa = await vpaRepository.findById(id);
        if (!vpa) {
            throw new AppError("VPA not found", 404);
        }
        if (vpa.status === "SUSPENDED") {
            throw new AppError("VPA is already suspended", 409);
        }
        if (vpa.status === "DELETED") {
            throw new AppError("Cannot suspend a deleted VPA", 400);
        }
        return await vpaRepository.updateStatus(id, "SUSPENDED");
    }

    // ACTIVATE VPA
    async activateVpa(id) {
        const vpa = await vpaRepository.findById(id);
        if (!vpa) {
            throw new AppError("VPA not found", 404);
        }
        if (vpa.status === "ACTIVE") {
            throw new AppError("VPA is already active", 409);
        }
        if (vpa.status === "DELETED") {
            throw new AppError("Cannot activate a deleted VPA", 400);
        }
        return await vpaRepository.updateStatus(id, "ACTIVE");
    }

    // DELETE VPA (soft delete — status = DELETED)
    async deleteVpa(id) {
        const vpa = await vpaRepository.findById(id);
        if (!vpa) {
            throw new AppError("VPA not found", 404);
        }
        if (vpa.status === "DELETED") {
            throw new AppError("VPA is already deleted", 409);
        }
        return await vpaRepository.updateStatus(id, "DELETED");
    }

    // SET / CHANGE UPI PIN
    async setPin(id, pin) {
        const vpa = await vpaRepository.findById(id);
        if (!vpa) {
            throw new AppError("VPA not found", 404);
        }
        if (vpa.status !== "ACTIVE") {
            throw new AppError(`Cannot set PIN on a ${vpa.status} VPA`, 400);
        }
        const pinHash = await bcrypt.hash(pin, PIN_BCRYPT_ROUNDS);
        await vpaRepository.updatePinHash(id, pinHash);
        return { message: "UPI PIN set successfully" };
    }

    // VERIFY UPI PIN
    // Logs attempt; locks after MAX_FAILED_PIN_ATTEMPTS
    async verifyPin(id, pin, ipAddress = null, userAgent = null) {
        const vpa = await vpaRepository.findById(id);
        if (!vpa) {
            throw new AppError("VPA not found", 404);
        }
        if (vpa.status !== "ACTIVE") {
            throw new AppError(`VPA is ${vpa.status} and cannot be used`, 400);
        }
        if (!vpa.pinHash) {
            throw new AppError("UPI PIN not set. Please set your PIN first.", 400);
        }
        // Check lockout
        const recentFailures = await pinAttemptRepository.countRecentFailures(
            id,
            LOCKOUT_WINDOW_MINUTES
        );
        if (recentFailures >= MAX_FAILED_PIN_ATTEMPTS) {
            throw new AppError(
                `Too many failed PIN attempts. Try again after ${LOCKOUT_WINDOW_MINUTES} minutes.`,
                429
            );
        }
        const isValid = await bcrypt.compare(pin, vpa.pinHash);
        // Log the attempt
        await pinAttemptRepository.log(id, isValid, ipAddress, userAgent);
        if (!isValid) {
            const remaining = MAX_FAILED_PIN_ATTEMPTS - (recentFailures + 1);
            throw new AppError(
                remaining > 0
                    ? `Incorrect PIN. ${remaining} attempt(s) remaining.`
                    : `Incorrect PIN. Your VPA is now locked for ${LOCKOUT_WINDOW_MINUTES} minutes.`,
                401
            );
        }
        return { verified: true };
    }

    // VPA EXISTS CHECK (used by other services)
    async vpaExists(id) {
        return await vpaRepository.exists(id);
    }

}

export default new VpaService();