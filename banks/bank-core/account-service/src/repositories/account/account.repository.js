import prisma from "../../config/db.js";

class AccountRepository {
    async create(data) {
        return prisma.account.create({
            data,
            include: {
                branch: true,
                limits: true,
            },
        });
    }

    async findAll() {
        return prisma.account.findMany({
            include: {
                branch: true,
                limits: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findById(id) {
        return prisma.account.findUnique({
            where: {
                id,
            },
            include: {
                branch: true,
                limits: true,
            },
        });
    }

    async findByAccountNumber(accountNumber) {
        return prisma.account.findUnique({
            where: {
                accountNumber,
            },
            include: {
                branch: true,
                limits: true,
            },
        });
    }

    async findByCustomerId(customerId) {
        return prisma.account.findMany({
            where: {
                customerId,
            },
            include: {
                branch: true,
                limits: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findByBranch(branchId) {
        return prisma.account.findMany({
            where: {
                branchId,
            },
            include: {
                branch: true,
                limits: true,
            },
        });
    }

    async update(id, data) {
        return prisma.account.update({
            where: {
                id,
            },
            data,
            include: {
                branch: true,
                limits: true,
            },
        });
    }

    async updateStatus(id, status) {
        return prisma.account.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });
    }

    async closeAccount(id) {
        return prisma.account.update({
            where: {
                id,
            },
            data: {
                status: "CLOSED",
            },
        });
    }

    async freezeAccount(id) {
        return prisma.account.update({
            where: {
                id,
            },
            data: {
                status: "FROZEN",
            },
        });
    }

    async activateAccount(id) {
        return prisma.account.update({
            where: {
                id,
            },
            data: {
                status: "ACTIVE",
            },
        });
    }

    async exists(id) {
        const account = await prisma.account.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
            },
        });

        return !!account;
    }

    async countCustomerAccounts(customerId) {
        return prisma.account.count({
            where: {
                customerId,
            },
        });
    }

    /**
     * Atomically decrement availableBalance by `amount`.
     * Returns the updated account row.
     */
    async debitBalance(id, amount) {
        return prisma.account.update({
            where: { id },
            data: {
                availableBalance: { decrement: amount },
            },
        });
    }

    /**
     * Atomically increment availableBalance by `amount`.
     * Returns the updated account row.
     */
    async creditBalance(id, amount) {
        return prisma.account.update({
            where: { id },
            data: {
                availableBalance: { increment: amount },
            },
        });
    }

    async delete(id) {
        // Development only.
        // In production banking, prefer soft delete or CLOSED status.
        return prisma.account.delete({
            where: {
                id,
            },
        });
    }
}

export default new AccountRepository();