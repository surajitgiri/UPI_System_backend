import prisma from "../../config/db.js";

class AddressRepository {
    async create(data) {
        return await prisma.address.create({
            data,
        });
    }

    async createMany(data) {
        return await prisma.address.createMany({
            data,
        });
    }

    async findAllByCustomerId(customerId) {
        return await prisma.address.findMany({
            where: {
                customerId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findById(id) {
        return await prisma.address.findUnique({
            where: {
                id,
            },
        });
    }

    async findByType(customerId, type) {
        return await prisma.address.findFirst({
            where: {
                customerId,
                type,
            },
        });
    }

    async update(id, data) {
        return await prisma.address.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id) {
        return await prisma.address.delete({
            where: {
                id,
            },
        });
    }

    async deleteByCustomerId(customerId) {
        return await prisma.address.deleteMany({
            where: {
                customerId,
            },
        });
    }
}

export default new AddressRepository();