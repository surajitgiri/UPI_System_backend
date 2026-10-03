import prisma from "../config/db.js";

class MandateRepository {

    async create(data) {
        return prisma.upiMandate.create({ data });
    }

    async findById(id) {
        return prisma.upiMandate.findUnique({
            where: { id },
        });
    }

    async findByMandateRef(mandateRef) {
        return prisma.upiMandate.findUnique({
            where: { mandateRef },
        });
    }

    async findByVpaId(vpaId) {
        return prisma.upiMandate.findMany({
            where: { vpaId },
            orderBy: { createdAt: "desc" },
        });
    }

    async findActiveByVpaId(vpaId) {
        return prisma.upiMandate.findMany({
            where: { vpaId, status: "ACTIVE" },
            orderBy: { startDate: "asc" },
        });
    }

    async updateStatus(id, status) {
        return prisma.upiMandate.update({
            where: { id },
            data: { status },
        });
    }

    async expireOldMandates() {
        return prisma.upiMandate.updateMany({
            where: {
                status: "ACTIVE",
                endDate: { lt: new Date() },
            },
            data: { status: "EXPIRED" },
        });
    }

    async mandateRefExists(mandateRef) {
        const mandate = await prisma.upiMandate.findUnique({
            where: { mandateRef },
            select: { id: true },
        });
        return !!mandate;
    }

    async exists(id) {
        const mandate = await prisma.upiMandate.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!mandate;
    }

    async count() {
        return prisma.upiMandate.count();
    }
}

export default new MandateRepository();
