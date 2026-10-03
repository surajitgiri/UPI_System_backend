import prisma from "../config/db.js";

class SwitchLogRepository {

    async log(txnId, event, message, level = "INFO", metadata = null) {
        return prisma.switchLog.create({
            data: { txnId, event, message, level, metadata },
        });
    }

    async info(txnId, event, message, metadata = null) {
        return this.log(txnId, event, message, "INFO", metadata);
    }

    async warn(txnId, event, message, metadata = null) {
        return this.log(txnId, event, message, "WARN", metadata);
    }

    async error(txnId, event, message, metadata = null) {
        return this.log(txnId, event, message, "ERROR", metadata);
    }

    async findByTxnId(txnId) {
        return prisma.switchLog.findMany({
            where: { txnId },
            orderBy: { createdAt: "asc" },
        });
    }

    async findByEvent(event) {
        return prisma.switchLog.findMany({
            where: { event },
            orderBy: { createdAt: "desc" },
        });
    }

    async findByLevel(level) {
        return prisma.switchLog.findMany({
            where: { level },
            orderBy: { createdAt: "desc" },
            take: 100,
        });
    }

    async deleteOlderThan(days = 30) {
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return prisma.switchLog.deleteMany({
            where: { createdAt: { lt: cutoff } },
        });
    }
}

export default new SwitchLogRepository();
