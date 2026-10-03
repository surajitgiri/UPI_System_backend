import prisma from "../config/db.js";

class TransactionRepository {

    //create transaction
    async create(data) {
        return await prisma.transaction.create({
            data,
        });
    }

    //Get all transactions
    async findAll() {
        return await prisma.transaction.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    // Get transaction by ID
    async findById(id) {
        return await prisma.transaction.findUnique({
            where: {
                id,
            },
        });
    }

    // Get transactions by source account
    async findBySourceAccount(sourceAccountId) {
        return await prisma.transaction.findMany({
            where: {
                sourceAccountId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    // Get transactions by destination account
    async findByDestinationAccount(destinationAccountId) {
        return await prisma.transaction.findMany({
            where: {
                destinationAccountId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    // Get all transactions related to an account
    // Includes both source and destination transactions
    async findByAccount(accountId) {
        return await prisma.transaction.findMany({
            where: {
                OR: [
                    {
                        sourceAccountId: accountId,
                    },
                    {
                        destinationAccountId: accountId,
                    },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    // Get transactions by status
    async findByStatus(status) {
        return await prisma.transaction.findMany({
            where: {
                status,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    // Get transactions by type
    async findByType(type) {
        return await prisma.transaction.findMany({
            where: {
                type,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    // Get transactions by account and status
    async findByAccountAndStatus(accountId, status) {
        return await prisma.transaction.findMany({
            where: {
                status,
                OR: [
                    {
                        sourceAccountId: accountId,
                    },
                    {
                        destinationAccountId: accountId,
                    },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    // Update transaction status
    async update(id, data) {
        return await prisma.transaction.update({
            where: {
                id,
            },
            data,
        });
    }

    // Mark transaction as processing
    async markProcessing(id) {
        return await prisma.transaction.update({
            where: {
                id,
            },
            data: {
                status: "PROCESSING",
            },
        });
    }

    // Mark transaction as successful
    async markSuccess(id) {
        return await prisma.transaction.update({
            where: {
                id,
            },
            data: {
                status: "SUCCESS",
            },
        });
    }

    // Mark transaction as failed
    async markFailed(id, failureReason = null) {
        return await prisma.transaction.update({
            where: {
                id,
            },
            data: {
                status: "FAILED",
                failureReason,
            },
        });
    }

    // Mark transaction as reversed
    async markReversed(id) {
        return await prisma.transaction.update({
            where: {
                id,
            },
            data: {
                status: "REVERSED",
            },
        });
    }

    // Check whether transaction exists
    async exists(id) {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
            },
        });

        return !!transaction;
    }

    // Check whether transaction reference exists
    async referenceExists(transactionReference) {
        const transaction = await prisma.transaction.findUnique({
            where: {
                transactionReference,
            },
            select: {
                id: true,
            },
        });

        return !!transaction;
    }

    // Count all transactions
    async count() {
        return await prisma.transaction.count();
    }

    // Get transaction by transaction reference
    async findByReference(transactionReference) {
        return await prisma.transaction.findUnique({
            where: {
                transactionReference,
            },
        });
    }

    // Count transactions by account
    async countByAccount(accountId) {
        return await prisma.transaction.count({
            where: {
                OR: [
                    {
                        sourceAccountId: accountId,
                    },
                    {
                        destinationAccountId: accountId,
                    },
                ],
            },
        });
    }

    // Count transactions by status
    async countByStatus(status) {
        return await prisma.transaction.count({
            where: {
                status,
            },
        });
    }

    // Count transactions by type
    async countByType(type) {
        return await prisma.transaction.count({
            where: {
                type,
            },
        });
    }

    // Delete transaction
    // Development/testing only.
    // In production, transactions should not normally be deleted.
    async delete(id) {
        return await prisma.transaction.delete({
            where: {
                id,
            },
        });
    }

}

export default new TransactionRepository();