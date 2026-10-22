import AppError from "../errors/AppError.js";
import vpaHandleRepository from "../repositories/vpaHandle.repository.js";
import participantRepository from "../repositories/participantBank.repository.js";

// Normalises "@OkHDFC" → "okhdfc"
const normalize = (handle) => handle.replace(/^@/, "").trim().toLowerCase();

class VpaHandleService {

    async createHandle({ handle, bankCode }) {
        const h = normalize(handle);

        const participant = await participantRepository.findByBankCode(bankCode.toUpperCase());
        if (!participant) throw new AppError(`Participant '${bankCode}' not found`, 404);
        if (participant.status !== "ACTIVE") {
            throw new AppError(`Participant '${bankCode}' is not ACTIVE`, 400);
        }

        if (await vpaHandleRepository.exists(h)) {
            throw new AppError(`Handle '@${h}' already exists`, 409);
        }

        return vpaHandleRepository.create({ handle: h, participantId: participant.id });
    }

    async getAllHandles() {
        return vpaHandleRepository.findAll();
    }

    async getHandle(handle) {
        const row = await vpaHandleRepository.findByHandle(normalize(handle));
        if (!row) throw new AppError(`Handle '${handle}' not found`, 404);
        return row;
    }

    async getHandlesByBankCode(bankCode) {
        const participant = await participantRepository.findByBankCode(bankCode.toUpperCase());
        if (!participant) throw new AppError(`Participant '${bankCode}' not found`, 404);
        return vpaHandleRepository.findByParticipantId(participant.id);
    }

    async setActive(id, isActive) {
        const row = await vpaHandleRepository.findById(id);
        if (!row) throw new AppError("Handle not found", 404);
        return vpaHandleRepository.setActive(id, isActive);
    }
}

export default new VpaHandleService();
