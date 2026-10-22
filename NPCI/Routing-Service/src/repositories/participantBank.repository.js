import prisma from "../config/db.js";

class ParticipantRepository {
    async create(data) {
        return prisma.participant.create({ data });
    }

    async findAll() {
        return prisma.participant.findMany({
            orderBy: { bankCode: "asc" }
        })
    }

    async findById(id) {
        return prisma.participant.findUnique({
            where: { id },
            include: { handles: true },
        });
    }

    async findByBankCode(bankCode) {
        return prisma.participant.findUnique({
            where: { bankCode },
            include: { handles: true },
        });
    }

    async findByStatus(status) {
        return prisma.participant.findMany({
            where: { status },
            orderBy: { bankCode: "asc" },
        });
    }

    async update(id, data) {
        return prisma.participant.update({
            where: { id },
            data,
        });
    }
    async updateStatus(id, status) {
        return prisma.participant.update({
            where: { id },
            data: { status },
        });
    }
    async exists(bankCode) {
        const participant = await prisma.participant.findUnique({
            where: { bankCode },
            select: { id: true },
        });
        return !!participant;
    }
}

export default new ParticipantRepository();