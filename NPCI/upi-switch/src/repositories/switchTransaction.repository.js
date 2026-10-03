import prisma from "../config/db.js";

class SwitchTransactionRepository {

    async create(data) {
        return prisma.switchTransaction.create({ data });
    }

    async findAll() {
        return prisma.switchTransaction.findMany({
            orderBy: { receivedAt: "desc" },
        });
    }

    async findById(id) {
        return prisma.switchTransaction.findUnique({
            where: { id },
            include: { logs: true, reversalRequest: true },
        });
    }

    async findByRrn(rrn) {
        return prisma.switchTransaction.findUnique({
            where: { rrn },
        });
    }

    async findByTxnRef(txnRef) {
        return prisma.switchTransaction.findUnique({
            where: { txnRef },
        });
    }

    async findBySenderVpa(senderVpa) {
        return prisma.switchTransaction.findMany({
            where: { senderVpa },
            orderBy: { receivedAt: "desc" },
        });
    }

    async findByReceiverVpa(receiverVpa) {
        return prisma.switchTransaction.findMany({
            where: { receiverVpa },
            orderBy: { receivedAt: "desc" },
        });
    }

    async findByStatus(status) {
        return prisma.switchTransaction.findMany({
            where: { status },
            orderBy: { receivedAt: "desc" },
        });
    }

    async findBySenderBank(senderBankCode) {
        return prisma.switchTransaction.findMany({
            where: { senderBankCode },
            orderBy: { receivedAt: "desc" },
        });
    }

    async findByReceiverBank(receiverBankCode) {
        return prisma.switchTransaction.findMany({
            where: { receiverBankCode },
            orderBy: { receivedAt: "desc" },
        });
    }

    async updateStatus(id, status, extra = {}) {
        return prisma.switchTransaction.update({
            where: { id },
            data: {
                status,
                ...extra,
                ...(["SUCCESS", "FAILED", "REVERSED", "TIMEOUT", "DUPLICATE"].includes(status)
                    ? { completedAt: new Date() }
                    : {}),
            },
        });
    }

    async markRouted(id, routedAt = new Date()) {
        return prisma.switchTransaction.update({
            where: { id },
            data: { status: "ROUTING", routedAt },
        });
    }

    async markDebited(id) {
        return prisma.switchTransaction.update({
            where: { id },
            data: {
                status: "PROCESSING",
                debitedAt: new Date(),
            },
        });
    }

    async markSettled(id, npciTxnId = null) {
        return prisma.switchTransaction.update({
            where: { id },
            data: {
                status: "SUCCESS",
                creditedAt: new Date(),
                settledAt: new Date(),
                completedAt: new Date(),
                npciTxnId,
            },
        });
    }

    async markFailed(id, failureReason, failureCode = null) {
        return prisma.switchTransaction.update({
            where: { id },
            data: {
                status: "FAILED",
                failureReason,
                failureCode,
                completedAt: new Date(),
            },
        });
    }

    async markReversed(id) {
        return prisma.switchTransaction.update({
            where: { id },
            data: {
                status: "REVERSED",
                completedAt: new Date(),
            },
        });
    }

    async rrnExists(rrn) {
        const txn = await prisma.switchTransaction.findUnique({
            where: { rrn },
            select: { id: true },
        });
        return !!txn;
    }

    async count() {
        return prisma.switchTransaction.count();
    }


    async countByBankAndDate(bankCode, from, to) {
        return prisma.switchTransaction.count({
            where: {
                senderBankCode: bankCode,
                receivedAt: { gte: from, lte: to },
                status: { notIn: ["FAILED", "TIMEOUT", "DUPLICATE"] },
            },
        });
    }

    async sumByBankAndDate(bankCode, from, to) {
        return prisma.switchTransaction.aggregate({
            where: {
                senderBankCode: bankCode,
                receivedAt: { gte: from, lte: to },
                status: { notIn: ["FAILED", "TIMEOUT", "DUPLICATE"] },
            },
            _sum: { amount: true },
        });
    }
}

export default new SwitchTransactionRepository();