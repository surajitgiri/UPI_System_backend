import prisma from "../config/db.js";

class VpaHandleRepository {

    async create(data) {
        return prisma.vpaHandle.create({ data });
    }

    async findAll() {
        return prisma.vpaHandle.findMany({
            include: { participant: true },
            orderBy: { handle: "asc" },
        });
    }

    async findById(id) {
        return prisma.vpaHandle.findUnique({
            where: { id },
            include: { participant: true },
        });
    }

    // handle is stored without "@", e.g. "okhdfc"
    async findByHandle(handle) {
        return prisma.vpaHandle.findUnique({
            where: { handle },
            include: { participant: true },
        });
    }

    async findByParticipantId(participantId) {
        return prisma.vpaHandle.findMany({
            where: { participantId },
            orderBy: { handle: "asc" },
        });
    }

    async setActive(id, isActive) {
        return prisma.vpaHandle.update({
            where: { id },
            data: { isActive },
        });
    }

    async exists(handle) {
        const row = await prisma.vpaHandle.findUnique({
            where: { handle },
            select: { id: true },
        });
        return !!row;
    }
}

export default new VpaHandleRepository();
