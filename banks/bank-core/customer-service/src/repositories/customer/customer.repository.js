import prisma from "../../config/db.js"

class CustomerRepository {
    async create(data) {
        return await prisma.customer.create({
            data,
        });
    }

    async findAll() {
        return await prisma.customer.findMany({
            include: {
                addresses: true,
                nominee: true,
                kyc: true
            },
            orderBy: {
                createdAt: 'desc'
            },
        });
    }

    async findById(id) {
        return await prisma.customer.findUnique({
            where: {
                id,
            },
            include: {
                addresses: true,
                nominee: true,
                kyc: true,
            }
        });
    }

    async findByCustomerNumber(customerNumber) {
        return await prisma.customer.findUnique({
            where: {
                customerNumber,
            },
        });
    }

    async findByEmail(email) {
        return await prisma.customer.findUnique({
            where: {
                email,
            },
        });
    }

    async findByPhone(phone) {
        return await prisma.customer.findUnique({
            where: {
                phone,
            }
        });
    }

    async update(id, data) {
        return await prisma.customer.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id) {
        return await prisma.customer.update({
            where: {
                id,
            },
            data: {
                status: "CLOSED",
            },
        });
    }
}

export default new CustomerRepository();