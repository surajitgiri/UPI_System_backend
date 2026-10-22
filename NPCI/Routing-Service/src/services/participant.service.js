import AppError from "../errors/AppError.js";
import participantRepository from "../repositories/participantBank.repository.js";

class ParticipantService {

    async createParticipant({ bankCode, name, type, ifscPrefix, grpcAddress, callbackUrl }) {
        const code = bankCode.toUpperCase();

        if (await participantRepository.exists(code)) {
            throw new AppError(`Participant '${code}' already exists`, 409);
        }

        return participantRepository.create({
            bankCode: code,
            name,
            type,
            ifscPrefix,
            grpcAddress,
            callbackUrl,
        });
    }

    async getAllParticipants() {
        return participantRepository.findAll();
    }

    async getParticipantById(id) {
        const participant = await participantRepository.findById(id);
        if (!participant) throw new AppError("Participant not found", 404);
        return participant;
    }

    async getParticipantByBankCode(bankCode) {
        const participant = await participantRepository.findByBankCode(bankCode.toUpperCase());
        if (!participant) throw new AppError(`Participant '${bankCode}' not found`, 404);
        return participant;
    }

    async getParticipantsByStatus(status) {
        return participantRepository.findByStatus(status);
    }

    async updateParticipant(id, data) {
        await this.getParticipantById(id);
        // bankCode is immutable — it is referenced by routes
        delete data.bankCode;
        return participantRepository.update(id, data);
    }

    async updateStatus(id, status) {
        await this.getParticipantById(id);
        return participantRepository.updateStatus(id, status);
    }
}

export default new ParticipantService();
