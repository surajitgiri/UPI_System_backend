import prisma from "../../config/db.js";

class NomineeRepository {
    async create(data) {
        return await prisma.nominee.create({
            data,
        });
    }

    async findByCustomerId(customerId) {
        return await prisma.nominee.findUnique({
            where: {
                customerId,
            },
        });
    }

    async findById(id) {
        return await prisma.nominee.findUnique({
            where: {
                id
            },
        });
    }

    async update(customerId, data) {
        return await prisma.nominee.update({
            where: {
                customerId,
            },
            data,
        });
    }

    async delete(customerId) {
        return await prisma.nominee.delete({
            where: {
                customerId,
            },
        });
    }
}

export default new NomineeRepository();