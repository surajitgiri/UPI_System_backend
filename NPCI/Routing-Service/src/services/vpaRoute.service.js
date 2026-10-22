import AppError from "../errors/AppError.js";
import vpaRouteRepository from "../repositories/vpaRoute.repository.js";
import vpaHandleRepository from "../repositories/vpaHandle.repository.js";
import lookupLogRepository from "../repositories/lookupLog.repository.js";

class VpaRouteService {

    // ── Register a VPA route (called when a bank creates a VPA) ────────
    async registerRoute({ vpa, vpaId, accountId }) {
        const address = vpa.trim().toLowerCase();

        if (!address.includes("@")) {
            throw new AppError("VPA must be in the format user@handle", 400);
        }

        const handleName = address.split("@")[1];
        const handle = await vpaHandleRepository.findByHandle(handleName);
        if (!handle) throw new AppError(`Handle '@${handleName}' is not registered`, 404);
        if (!handle.isActive) throw new AppError(`Handle '@${handleName}' is inactive`, 400);
        if (handle.participant.status !== "ACTIVE") {
            throw new AppError(`Participant '${handle.participant.bankCode}' is not ACTIVE`, 400);
        }

        if (await vpaRouteRepository.exists(address)) {
            throw new AppError(`VPA '${address}' is already registered`, 409);
        }

        return vpaRouteRepository.create({
            vpa: address,
            vpaId,
            accountId,
            participantId: handle.participantId,
            bankCode: handle.participant.bankCode,
        });
    }

    // ── Resolve VPA → { vpaId, accountId, bankCode } (used by switch) ──
    async lookupVpa(vpaAddress, requestedBy = null) {
        const vpa = (vpaAddress || "").trim().toLowerCase();
        const route = await vpaRouteRepository.findByVpa(vpa);

        if (!route) {
            await lookupLogRepository.log({ vpa, result: "NOT_FOUND", requestedBy, message: "VPA not registered" });
            return { success: false, message: `VPA '${vpa}' not found`, data: null };
        }

        if (route.status !== "ACTIVE") {
            await lookupLogRepository.log({
                vpa, result: "INACTIVE", bankCode: route.bankCode, requestedBy,
                message: `Route status ${route.status}`,
            });
            return { success: false, message: `VPA '${vpa}' is ${route.status}`, data: null };
        }

        await lookupLogRepository.log({ vpa, result: "FOUND", bankCode: route.bankCode, requestedBy });

        return {
            success: true,
            message: "VPA resolved",
            data: {
                vpaId: route.vpaId,
                vpa: route.vpa,
                accountId: route.accountId,
                bankCode: route.bankCode,
            },
        };
    }

    async getAllRoutes() {
        return vpaRouteRepository.findAll();
    }

    async getRoute(vpa) {
        const route = await vpaRouteRepository.findByVpa(vpa.trim().toLowerCase());
        if (!route) throw new AppError(`VPA '${vpa}' not found`, 404);
        return route;
    }

    async getRoutesByBankCode(bankCode) {
        return vpaRouteRepository.findByBankCode(bankCode.toUpperCase());
    }

    async getRoutesByStatus(status) {
        return vpaRouteRepository.findByStatus(status);
    }

    async updateStatus(vpa, status) {
        await this.getRoute(vpa);
        return vpaRouteRepository.updateStatus(vpa.trim().toLowerCase(), status);
    }

    async deleteRoute(vpa) {
        await this.getRoute(vpa);
        return vpaRouteRepository.delete(vpa.trim().toLowerCase());
    }
}

export default new VpaRouteService();
