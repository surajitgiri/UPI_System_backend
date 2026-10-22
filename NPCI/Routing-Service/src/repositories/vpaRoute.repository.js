import prisma from "../config/db.js";

class VpaRouteRepository {

    async create(data) {
        return prisma.vpaRoute.create({ data });
    }

    async findAll() {
        return prisma.vpaRoute.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    async findById(id) {
        return prisma.vpaRoute.findUnique({
            where: { id },
            include: { participant: true },
        });
    }

    // Main lookup used by the gRPC LookupVpa handler
    async findByVpa(vpa) {
        return prisma.vpaRoute.findUnique({
            where: { vpa },
        });
    }

    async findByVpaId(vpaId) {
        return prisma.vpaRoute.findUnique({
            where: { vpaId },
        });
    }

    async findByBankCode(bankCode) {
        return prisma.vpaRoute.findMany({
            where: { bankCode },
            orderBy: { createdAt: "desc" },
        });
    }

    async findByStatus(status) {
        return prisma.vpaRoute.findMany({
            where: { status },
            orderBy: { createdAt: "desc" },
        });
    }

    async update(vpa, data) {
        return prisma.vpaRoute.update({
            where: { vpa },
            data,
        });
    }

    async upsert(vpa, data) {
        return prisma.vpaRoute.upsert({
            where: { vpa },
            update: data,
            create: { vpa, ...data },
        });
    }

    async updateStatus(vpa, status) {
        return prisma.vpaRoute.update({
            where: { vpa },
            data: { status },
        });
    }

    async delete(vpa) {
        return prisma.vpaRoute.delete({
            where: { vpa },
        });
    }

    async exists(vpa) {
        const route = await prisma.vpaRoute.findUnique({
            where: { vpa },
            select: { id: true },
        });
        return !!route;
    }
}

export default new VpaRouteRepository();
