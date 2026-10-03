import KycService from "../services/kyc.services.js";
import {
    successResponse,
} from "../utils/response.js";

import { createKycSchema, updateKycSchema } from "../validators/kyc.validator.js";




class KycController {
    async createKyc(req, res, next) {
        try {
            const { customerId } = req.params;
            const validateData = createKycSchema.parse(req.body)

            const kyc = await KycService.createKyc(
                customerId,
                validateData
            );

            return successResponse(
                res,
                "KYC created successfully",
                kyc,
                201
            );
        } catch (error) {
            next(error);
        }
    }

    async getKyc(req, res, next) {
        try {
            const { customerId } = req.params;

            const kyc = await KycService.getKyc(customerId);

            return successResponse(
                res,
                "KYC fetched successfully",
                kyc
            );
        } catch (error) {
            next(error);
        }
    }

    async updateKyc(req, res, next) {
        try {
            const { customerId } = req.params;

            const validateData = updateKycSchema.parse(req.body);

            const kyc = await KycService.updateKyc(
                customerId,
                validateData
            );

            return successResponse(
                res,
                "KYC updated successfully",
                kyc
            );
        } catch (error) {
            next(error);
        }
    }

    async verifyKyc(req, res, next) {
        try {
            const { customerId } = req.params;

            const { verifiedBy } = req.body;

            const kyc = await KycService.verifyKyc(
                customerId,
                verifiedBy
            );

            return successResponse(
                res,
                "KYC verified successfully",
                kyc
            );
        } catch (error) {
            next(error);
        }
    }

    async rejectKyc(req, res, next) {
        try {
            const { customerId } = req.params;

            const { verifiedBy } = req.body;

            const kyc = await KycService.rejectKyc(
                customerId,
                verifiedBy
            );

            return successResponse(
                res,
                "KYC rejected successfully",
                kyc
            );
        } catch (error) {
            next(error);
        }
    }

    async deleteKyc(req, res, next) {
        try {
            const { customerId } = req.params;

            await KycService.deleteKyc(customerId);

            return successResponse(
                res,
                "KYC deleted successfully"
            );
        } catch (error) {
            next(error);
        }
    }
}

export default new KycController();