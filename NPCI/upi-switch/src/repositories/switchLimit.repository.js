import prisma from "../config/db.js";

class SwitchLimitRepository {

    async create(data) {
        return prisma.switchLimit.create({ data });
    }

    async findAll() {
        return prisma.switchLimit.findMany({
            orderBy: { bankCode: "asc" },
        });
    }

    async findByBankCode(bankCode) {
        return prisma.switchLimit.findUnique({
            where: { bankCode },
        });
    }

    async update(bankCode, data) {
        return prisma.switchLimit.update({
            where: { bankCode },
            data,
        });
    }

    async upsert(bankCode, data) {
        return prisma.switchLimit.upsert({
            where: { bankCode },
            update: data,
            create: { bankCode, ...data },
        });
    }

    async setActive(bankCode, isActive) {
        return prisma.switchLimit.update({
            where: { bankCode },
            data: { isActive },
        });
    }

    async exists(bankCode) {
        const limit = await prisma.switchLimit.findUnique({
            where: { bankCode },
            select: { bankCode: true },
        });
        return !!limit;
    }
}

export default new SwitchLimitRepository();
