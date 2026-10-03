import prisma from "../config/db.js";

class PinAttemptRepository {

    async log(vpaId, success, ipAddress = null, userAgent = null) {
        return prisma.pinAttemptLog.create({
            data: { vpaId, success, ipAddress, userAgent },
        });
    }

    // Count failed attempts in the last N minutes (for lockout logic)
    async countRecentFailures(vpaId, withinMinutes = 30) {
        const since = new Date(Date.now() - withinMinutes * 60 * 1000);
        return prisma.pinAttemptLog.count({
            where: {
                vpaId,
                success: false,
                createdAt: { gte: since },
            },
        });
    }

    async findByVpaId(vpaId) {
        return prisma.pinAttemptLog.findMany({
            where: { vpaId },
            orderBy: { createdAt: "desc" },
            take: 50,
        });
    }

    // Delete old logs older than N days (for cleanup jobs)
    async deleteOlderThan(days = 90) {
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return prisma.pinAttemptLog.deleteMany({
            where: { createdAt: { lt: cutoff } },
        });
    }
}

export default new PinAttemptRepository();
