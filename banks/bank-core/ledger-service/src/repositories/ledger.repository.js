import prisma from "../config/db.js";

class LedgerRepository {
    //Create a ledger entry
    async create(data) {
        return await prisma.ledgerEntry.create({
            data,
        });
    }

    // Create multiple ledger entries
    async createMany(data) {
        return await prisma.ledgerEntry.createMany({
            data,
        });
    }

    //Get all ledger entries
    async findAll() {
        return await prisma.ledgerEntry.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    //Get ledger entry by ID
    async findById(id) {
        return await prisma.ledgerEntry.findUnique({
            where: {
                id,
            },
        });
    }

    // Get ledger entries by account ID
    async findByAccountId(accountId) {
        return await prisma.ledgerEntry.findMany({
            where: {
                accountId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    // Get ledger entries by transaction ID
    async findByTransactionId(transactionId) {
        return await prisma.ledgerEntry.findMany({
            where: {
                transactionId,
            },
            orderBy: {
                createdAt: "asc"
            },
        });
    }

    // Get account ledger with pagination
    async findAccountLedger(accountId, skip = 0, take = 50) {
        return await prisma.ledgerEntry.findMany({
            where: {
                accountId,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take,
        });

    }

    // Get latest ledger entry for an account
    async findLatestEntry(accountId) {
        return await prisma.ledgerEntry.findFirst({
            where: {
                accountId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    //Get latest POSTED ledger entry for an account
    async findLatestPostedEntry(accountId) {
        return await prisma.ledgerEntry.findFirst({
            where: {
                accountId,
                status: "POSTED",
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    // Update ledger entry
    // Use carefully - financial ledger should normally be immutable.
    async update(id, data) {
        return await prisma.ledgerEntry.update({
            where: {
                id,
            },
            data,
        });
    }

    // Mark ledger entry as reversed
    async reverse(id) {
        return await prisma.ledgerEntry.update({
            where: {
                id,
            },
            data: {
                status: "REVERSED",
            },
        });
    }

    // Count all ledger entries
    async count() {
        return await prisma.ledgerEntry.count();
    }

    // Count ledger entries for an account
    async countByAccountId(accountId) {
        return await prisma.ledgerEntry.count({
            where: {
                accountId,
            },
        });
    }

    // Count ledger entries for a transaction
    async countByTransactionId(transactionId) {
        return await prisma.ledgerEntry.count({
            where: {
                transactionId,
            },
        });
    }

    // Check if ledger entry exists
    async exists(id) {
        const entry = await prisma.ledgerEntry.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
            },
        });

        return !!entry;
    }

    // Delete ledger entry
    // Development/testing only.
    // Production ledger entries should generally NOT be deleted.
    async delete(id) {
        return await prisma.ledgerEntry.delete({
            where: {
                id,
            },
        });
    }
}

export default new LedgerRepository();
