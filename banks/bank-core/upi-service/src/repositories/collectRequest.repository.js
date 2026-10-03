import prisma from "../config/db.js";

class CollectRequestRepository {

    async create(data) {
        return prisma.collectRequest.create({ data });
    }

    async findById(id) {
        return prisma.collectRequest.findUnique({
            where: { id },
        });
    }

    async findByInitiatorVpaId(initiatorVpaId) {
        return prisma.collectRequest.findMany({
            where: { initiatorVpaId },
            orderBy: { createdAt: "desc" },
        });
    }

    async findByTargetVpaId(targetVpaId) {
        return prisma.collectRequest.findMany({
            where: { targetVpaId },
            orderBy: { createdAt: "desc" },
        });
    }

    // All pending requests for a target VPA (inbox)
    async findPendingByTargetVpaId(targetVpaId) {
        return prisma.collectRequest.findMany({
            where: {
                targetVpaId,
                status: "PENDING",
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async updateStatus(id, status) {
        return prisma.collectRequest.update({
            where: { id },
            data: { status },
        });
    }

    async markApproved(id, transactionId) {
        return prisma.collectRequest.update({
            where: { id },
            data: {
                status: "APPROVED",
                transactionId,
            },
        });
    }

    async markRejected(id) {
        return prisma.collectRequest.update({
            where: { id },
            data: { status: "REJECTED" },
        });
    }

    // Expire all past-deadline PENDING requests
    async expireOldRequests() {
        return prisma.collectRequest.updateMany({
            where: {
                status: "PENDING",
                expiresAt: { lt: new Date() },
            },
            data: { status: "EXPIRED" },
        });
    }

    async exists(id) {
        const req = await prisma.collectRequest.findUnique({
            where: { id },
            select: { id: true },
        });
        return !!req;
    }

    async count() {
        return prisma.collectRequest.count();
    }
}

export default new CollectRequestRepository();
