import prisma from "../../config/db.js";

class BranchRepository {
    //create a new branch
    async create(data) {
        return await prisma.branch.create({
            data,
        });
    }

    //Get all branches
    async findAll() {
        return await prisma.branch.findMany({
            orderBy: {
                createdAt: "desc"
            },
        });
    }

    //Get branch by id
    async findById(id) {
        return await prisma.branch.findUnique({
            where: {
                id,
            },
        });
    }

    //get branch by branch code
    async findByBranchCode(branchCode) {
        return await prisma.branch.findUnique({
            where: {
                branchCode,
            },
        });
    }

    //Get Branch by IFSC code
    async findByIfscCode(ifscCode) {
        return await prisma.branch.findUnique({
            where: {
                ifscCode,
            },
        });
    }

    //Update branch
    async update(id, data) {
        return await prisma.branch.update({
            where: {
                id,
            },
            data,
        });
    }

    //Delete Branch
    async delete(id) {
        return await prisma.branch.delete({
            where: {
                id,
            },
        });
    }

    //Count total branches
    async count() {
        return await prisma.branch.count();
    }

    // Search branches
    async search(keyword) {
        return await prisma.branch.findUnique({
            where: {
                OR: [
                    {
                        branchCode: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        branchName: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        ifscCode: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        city: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        state: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        country: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        pincode: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                    {
                        managerName: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            orderBy: {
                branchName: "asc"
            },
        });
    }

    //Get branch with all accounts
    async findWithAccounts(id) {
        return await prisma.branch.findUnique({
            where: {
                id,
            },
            include: {
                accounts: true,
            },
        });
    }
}

export default new BranchRepository();