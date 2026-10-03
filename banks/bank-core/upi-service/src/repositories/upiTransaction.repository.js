import prisma from "../config/db.js";

class UpiTransactionRepository {

    async create(data) {
        return prisma.upiTransaction.create({ data });
    }

    async findAll() {
        return prisma.upiTransaction.findMany({
            orderBy: { initiatedAt: "desc" },
        });
    }

    async findById(id) {
        return prisma.upiTransaction.findUnique({
            where: { id },
        });
    }

    async findByRrn(rrn) {
        return prisma.upiTransaction.findUnique({
            where: { rrn },
        });
    }

    async findByTxnRef(txnRef) {
        return prisma.upiTransaction.findUnique({
            where: { txnRef },
        });
    }

    async findBySenderVpaId(senderVpaId) {
        return prisma.upiTransaction.findMany({
            where: { senderVpaId },
            orderBy: { initiatedAt: "desc" },
        });
    }

    async findByReceiverVpaId(receiverVpaId) {
        return prisma.upiTransaction.findMany({
            where: { receiverVpaId },
            orderBy: { initiatedAt: "desc" },
        });
    }

    // All transactions (sent + received) for a VPA
    async findByVpaId(vpaId) {
        return prisma.upiTransaction.findMany({
            where: {
                OR: [
                    { senderVpaId: vpaId },
                    { receiverVpaId: vpaId },
                ],
            },
            orderBy: { initiatedAt: "desc" },
        });
    }

    async findByStatus(status) {
        return prisma.upiTransaction.findMany({
            where: { status },
            orderBy: { initiatedAt: "desc" },
        });
    }

    async findByType(type) {
        return prisma.upiTransaction.findMany({
            where: { type },
            orderBy: { initiatedAt: "desc" },
        });
    }

    async updateStatus(id, status, extra = {}) {
        return prisma.upiTransaction.update({
            where: { id },
            data: {
                status,
                ...extra,
                ...(["SUCCESS", "FAILED", "REVERSED", "EXPIRED", "DECLINED"].includes(status)
                    ? { completedAt: new Date() }
                    : {}),
            },
        });
    }

    async markSuccess(id, bankTxnId, npciTxnId) {
        return prisma.upiTransaction.update({
            where: { id },
            data: {
                status: "SUCCESS",
                completedAt: new Date(),
                bankTxnId,
                npciTxnId,
            },
        });
    }

    async markFailed(id, failureReason) {
        return prisma.upiTransaction.update({
            where: { id },
            data: {
                status: "FAILED",
                completedAt: new Date(),
                failureReason,
            },
        });
    }

    async rrnExists(rrn) {
        const txn = await prisma.upiTransaction.findUnique({
            where: { rrn },
            select: { id: true },
        });
        return !!txn;
    }

    async txnRefExists(txnRef) {
        const txn = await prisma.upiTransaction.findUnique({
            where: { txnRef },
            select: { id: true },
        });
        return !!txn;
    }

    async count() {
        return prisma.upiTransaction.count();
    }

    async countByVpaId(vpaId) {
        return prisma.upiTransaction.count({
            where: {
                OR: [
                    { senderVpaId: vpaId },
                    { receiverVpaId: vpaId },
                ],
            },
        });
    }
}

export default new UpiTransactionRepository();
