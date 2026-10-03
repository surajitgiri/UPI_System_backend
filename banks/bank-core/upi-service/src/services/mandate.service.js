import mandateRepository from "../repositories/mandate.repository.js";
import vpaRepository from "../repositories/vpa.repository.js";
import AppError from "../errors/AppError.js";
import { randomUUID } from "crypto";

class MandateService {

    // ─────────────────────────────────────────────
    // CREATE MANDATE
    // ─────────────────────────────────────────────
    async createMandate(data) {
        const { vpaAddress, payeeVpa, payeeAccountId, amount, currency, frequency, startDate, endDate, description, remarks } = data;

        const vpa = await vpaRepository.findByVpa(vpaAddress);
        if (!vpa) {
            throw new AppError(`VPA '${vpaAddress}' not found`, 404);
        }

        if (vpa.status !== "ACTIVE") {
            throw new AppError(`VPA is ${vpa.status} and cannot create mandates`, 400);
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime())) {
            throw new AppError("Invalid startDate", 400);
        }

        if (isNaN(end.getTime())) {
            throw new AppError("Invalid endDate", 400);
        }

        if (end <= start) {
            throw new AppError("endDate must be after startDate", 400);
        }

        if (amount <= 0) {
            throw new AppError("Amount must be greater than zero", 400);
        }

        // Generate unique mandate reference
        let mandateRef = `MND${randomUUID().replace(/-/g, "").toUpperCase().slice(0, 16)}`;
        while (await mandateRepository.mandateRefExists(mandateRef)) {
            mandateRef = `MND${randomUUID().replace(/-/g, "").toUpperCase().slice(0, 16)}`;
        }

        return await mandateRepository.create({
            mandateRef,
            vpaId: vpa.id,
            payeeVpa,
            payeeAccountId,
            amount,
            currency: currency || "INR",
            frequency,
            startDate: start,
            endDate: end,
            description,
            remarks,
            status: "CREATED",
        });
    }

    // ─────────────────────────────────────────────
    // GET MANDATE BY ID
    // ─────────────────────────────────────────────
    async getMandateById(id) {
        const mandate = await mandateRepository.findById(id);
        if (!mandate) {
            throw new AppError("Mandate not found", 404);
        }
        return mandate;
    }

    // ─────────────────────────────────────────────
    // GET ALL MANDATES FOR A VPA
    // ─────────────────────────────────────────────
    async getMandatesByVpaAddress(vpaAddress) {
        const vpa = await vpaRepository.findByVpa(vpaAddress);
        if (!vpa) {
            throw new AppError(`VPA '${vpaAddress}' not found`, 404);
        }
        return await mandateRepository.findByVpaId(vpa.id);
    }

    // ─────────────────────────────────────────────
    // ACTIVATE MANDATE
    // ─────────────────────────────────────────────
    async activateMandate(id) {
        const mandate = await mandateRepository.findById(id);
        if (!mandate) {
            throw new AppError("Mandate not found", 404);
        }

        if (mandate.status === "ACTIVE") {
            throw new AppError("Mandate is already active", 409);
        }

        if (["REVOKED", "EXPIRED"].includes(mandate.status)) {
            throw new AppError(`Cannot activate a ${mandate.status} mandate`, 400);
        }

        return await mandateRepository.updateStatus(id, "ACTIVE");
    }

    // ─────────────────────────────────────────────
    // PAUSE MANDATE
    // ─────────────────────────────────────────────
    async pauseMandate(id) {
        const mandate = await mandateRepository.findById(id);
        if (!mandate) {
            throw new AppError("Mandate not found", 404);
        }

        if (mandate.status !== "ACTIVE") {
            throw new AppError("Only active mandates can be paused", 400);
        }

        return await mandateRepository.updateStatus(id, "PAUSED");
    }

    // ─────────────────────────────────────────────
    // REVOKE MANDATE
    // ─────────────────────────────────────────────
    async revokeMandate(id) {
        const mandate = await mandateRepository.findById(id);
        if (!mandate) {
            throw new AppError("Mandate not found", 404);
        }

        if (mandate.status === "REVOKED") {
            throw new AppError("Mandate is already revoked", 409);
        }

        if (mandate.status === "EXPIRED") {
            throw new AppError("Cannot revoke an expired mandate", 400);
        }

        return await mandateRepository.updateStatus(id, "REVOKED");
    }

    // ─────────────────────────────────────────────
    // EXPIRE OLD MANDATES (cron/cleanup job)
    // ─────────────────────────────────────────────
    async expireOldMandates() {
        return await mandateRepository.expireOldMandates();
    }
}

export default new MandateService();
