import vpaRouteService from "../services/vpaRoute.service.js";

export const lookupVpaHandler = async (call, callback) => {
    try {
        const { vpaAddress } = call.request;

        if (!vpaAddress) {
            return callback(null, {
                success: false,
                message: "vpaAddress is required",
                data: null,
            });
        }

        const result = await vpaRouteService.lookupVpa(vpaAddress, "grpc");

        return callback(null, {
            success: result.success,
            message: result.message,
            data: result.data || null,
        });
    } catch (error) {
        return callback(null, {
            success: false,
            message: error.message || "Internal gRPC error during VPA lookup",
            data: null,
        });
    }
};
