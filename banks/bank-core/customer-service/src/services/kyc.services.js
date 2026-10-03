import kycRepository from "../repositories/kyc/kyc.repository.js";
import customerRepository from "../repositories/customer/customer.repository.js";

import NotFoundError from "../errors/NotFoundError.js";
import ValidationError from "../errors/ValidationError.js";

class KycService {
    async createKyc(customerId, data) {
        const customer = await customerRepository.findById(customerId);

        if (!customer) {
            throw new NotFoundError("Customer Not Found");
        }

        const existingKyc = await kycRepository.findByCustomerId(customerId);

        if (existingKyc) {
            throw new ValidationError("KYC already exists")
        }

        return await kycRepository.create({
            customerId,
            ...data,
        });
    }

    async getKyc(customerId) {
        const kyc = await kycRepository.findByCustomerId(customerId);

        if (!kyc) {
            throw new NotFoundError("KYC not found");
        }
        return kyc;
    }

    async updateKyc(customerId, data) {
        await this.getKyc(customerId);

        return await kycRepository.update(customerId, data);
    }

    async verifyKyc(customerId, verifiedBy) {
        await this.getKyc(customerId);

        return await kycRepository.verify(customerId, verifiedBy);
    }

    async rejectKyc(customerId, verifiedBy) {
        await this.getKyc(customerId);

        return await kycRepository.reject(customerId, verifiedBy);
    }

    async deleteKyc(customerId) {
        await this.getKyc(customerId);

        return await kycRepository.delete(customerId);
    }
}

export default new KycService();