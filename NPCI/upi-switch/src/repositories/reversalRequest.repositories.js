import prisma from "../config/db.js";

class ReversalRequestRepository {

    async create(data) {
        return prisma.reversalRequest.create({
            data,
            include: { transaction: true },
        });
    }

    async findById(id) {
        return prisma.reversalRequest.findUnique({
            where: { id },
            include: { transaction: true },
        });
    }

    async findByTxnId(txnId) {
        return prisma.reversalRequest.findUnique({
            where: { txnId },
            include: { transaction: true },
        });
    }

    async findByReversalRrn(reversalRrn) {
        return prisma.reversalRequest.findUnique({
            where: { reversalRrn },
        });
    }

    async findAll() {
        return prisma.reversalRequest.findMany({
            orderBy: { raisedAt: "desc" },
            include: { transaction: true },
        });
    }

    async findByStatus(status) {
        return prisma.reversalRequest.findMany({
            where: { status },
            orderBy: { raisedAt: "desc" },
            include: { transaction: true },
        });
    }

    async findByReason(reason) {
        return prisma.reversalRequest.findMany({
            where: { reason },
            orderBy: { raisedAt: "desc" },
        });
    }

    async updateStatus(id, status, extra = {}) {
        return prisma.reversalRequest.update({
            where: { id },
            data: {
                status,
                ...extra,
                ...(status === "SUCCESS"
                    ? { reversedAt: new Date() }
                    : {}),
            },
        });
    }

    async markSuccess(id) {
        return prisma.reversalRequest.update({
            where: { id },
            data: {
                status: "SUCCESS",
                reversedAt: new Date(),
            },
        });
    }

    async markFailed(id, failureReason) {
        return prisma.reversalRequest.update({
            where: { id },
            data: {
                status: "FAILED",
                failureReason,
            },
        });
    }

    async exists(txnId) {
        const req = await prisma.reversalRequest.findUnique({
            where: { txnId },
            select: { id: true },
        });
        return !!req;
    }

    async count() {
        return prisma.reversalRequest.count();
    }
}

export default new ReversalRequestRepository();
