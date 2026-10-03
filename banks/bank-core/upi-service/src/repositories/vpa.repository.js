import prisma from "../config/db.js";

class VpaRepository {

    async create(data) {
        return prisma.vpa.create({ data });
    }

    async findAll() {
        return prisma.vpa.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    async findById(id) {
        return prisma.vpa.findUnique({
            where: { id },
        });
    }

    async findByVpa(vpa) {
        return prisma.vpa.findUnique({
            where: { vpa },
        });
    }

    async findByUserId(userId) {
        return prisma.vpa.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }

    async findByAccountId(accountId) {
        return prisma.vpa.findMany({
            where: { accountId },
            orderBy: { createdAt: "desc" },
        });
    }

    async findPrimaryByUserId(userId) {
        return prisma.vpa.findFirst({
            where: { userId, isPrimary: true },
        });
    }

    async findDefaultByUserId(userId) {
        return prisma.vpa.findFirst({
            where: { userId, isDefault: true },
        });
    }

    async update(id, data) {
        return prisma.vpa.update({
            where: { id },
            data,
        });
    }

    async updateStatus(id, status) {
        return prisma.vpa.update({
            where: { id },
            data: { status },
        });
    }

    async updatePinHash(id, pinHash) {
        return prisma.vpa.update({
            where: { id },
            data: { pinHash },
        });
    }

    async exists(id) {
        const vpa = await prisma.vpa.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!vpa;
    }

    async vpaExists(vpa) {
        const record = await prisma.vpa.findUnique({
            where: { vpa },
            select: { id: true },
        });
        return !!record;
    }

    async delete(id) {
        return prisma.vpa.delete({
            where: { id },
        });
    }

    async count() {
        return prisma.vpa.count();
    }

    async countByUserId(userId) {
        return prisma.vpa.count({
            where: { userId },
        });
    }
}

export default new VpaRepository();
