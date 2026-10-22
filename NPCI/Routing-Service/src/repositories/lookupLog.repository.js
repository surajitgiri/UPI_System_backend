import prisma from "../config/db.js";

class LookupLogRepository {

    async create(data) {
        return prisma.lookupLog.create({ data });
    }

    // Fire-and-forget helper — logging must never break a lookup
    async log({ vpa, result, bankCode = null, requestedBy = null, message = null }) {
        try {
            return await prisma.lookupLog.create({
                data: { vpa, result, bankCode, requestedBy, message },
            });
        } catch (err) {
            console.error("LookupLog write failed:", err.message);
            return null;
        }
    }

    async findAll(limit = 100) {
        return prisma.lookupLog.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    }

    async findByVpa(vpa, limit = 100) {
        return prisma.lookupLog.findMany({
            where: { vpa },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    }

    async findByResult(result, limit = 100) {
        return prisma.lookupLog.findMany({
            where: { result },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    }
}

export default new LookupLogRepository();
