import prisma from "../../config/db.js";

class AccountLimitRepository {
    //Create account limit
    async create(data) {
        return await prisma.accountLimit.create({
            data,
        });
    }

    //Get all account limits
    async findAll() {
        return await prisma.accountLimit.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    //Get account limit by ID
    async findById(id) {
        return await prisma.accountLimit.findUnique({
            where: {
                id,
            },
        });
    }

    //Get account limit by Account ID
    async findByAccountId(accountId) {
        return await prisma.accountLimit.findUnique({
            where: {
                accountId,
            },
        });
    }

    //Get Account limit with account details
    async findWithAccount(accountId) {
        return await prisma.accountLimit.findUnique({
            where: {
                accountId,
            },
            include: {
                account: true
            },
        });
    }

    //Update account limit
    async update(id, data) {
        return await prisma.accountLimit.update({
            where: {
                id,
            },
            data,
        });
    }

    //Update account limit by Account ID
    async updateByAccountId(accountId, data) {
        return await prisma.accountLimit.update({
            where: {
                accountId,
            },
            data,
        });
    }

    //Delete account limit
    async delete(id) {
        return await prisma.accountLimit.delete({
            where: {
                id,
            },
        });
    }

    //Delete account limit by Account ID
    async deleteByAccountId(accountId) {
        return await prisma.accountLimit.delete({
            where: {
                accountId,
            },
        });
    }

    //Count account limits
    async count() {
        return await prisma.accountLimit.count();
    }
}

export default new AccountLimitRepository();