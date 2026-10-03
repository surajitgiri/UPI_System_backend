import prisma from "../../config/db.js";

class KycRepository {
    async create(data) {
        return await prisma.kYC.create({
            data,
        });
    }

    async findByCustomerId(customerId) {
        return await prisma.kYC.findUnique({
            where: {
                customerId,
            },
        });
    }

    async update(customerId, data) {
        return await prisma.kYC.update({
            where: {
                customerId,
            },
            data,
        });
    }

    async verify(customerId, verifiedBy) {
        return await prisma.kYC.update({
            where: {
                customerId,
            },
            data: {
                status: "VERIFIED",
                verifiedBy,
                verifiedAt: new Date(),
            },
        });
    }

    async reject(customerId, verifiedBy) {
        return await prisma.kYC.update({
            where: {
                customerId,
            },
            data: {
                status: "REJECTED",
                verifiedBy,
                verifiedAt: new Date(),
            },
        });
    }

    async delete(customerId) {
        return await prisma.kYC.delete({
            where: {
                customerId,
            },
        });
    }
}

export default new KycRepository();