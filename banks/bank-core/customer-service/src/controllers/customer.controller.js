import customerServices from "../services/customer.services.js";
import { successResponse } from "../utils/response.js"
import { createCustomerSchema, updateCustomerSchema } from "../validators/customer.validator.js";



class CustomerController {
    async createCustomer(req, res, next) {
        try {
            const validateData = createCustomerSchema.parse(req.body);
            const customer = await customerServices.createCustomer(validateData);

            return successResponse(
                res,
                "Customer created successfully",
                customer,
                201
            );
        } catch (error) {
            next(error);
        }
    }

    async getAllCustomers(req, res, next) {
        try {
            const customers = await customerServices.getAllCustomers();

            return successResponse(
                res,
                "Customers fetched successfully",
                customers
            );
        } catch (error) {
            next(error);
        }
    }

    async getCustomerById(req, res, next) {
        try {
            const { id } = req.params;

            const customer = await customerServices.getCustomerById(id);

            return successResponse(
                res,
                "Customer fetched successfully",
                customer
            )
        } catch (error) {
            next(error);
        }
    }

    async getCustomerByCustomerNumber(req, res, next) {
        try {
            const { customerNumber } = req.params;

            const customer = await customerServices.getCustomerByCustomerNumber(customerNumber);

            return successResponse(
                res,
                "Customer fetched successfully",
                customer
            )
        } catch (error) {
            next(error);
        }
    }

    async updateCustomer(req, res, next) {
        try {
            const { id } = req.params;
            const validateData = updateCustomerSchema.parse(req.body);

            const customer = await customerServices.updateCustomer(
                id,
                validateData
            );

            return successResponse(
                res,
                "Customer updated successfully",
                customer
            )
        } catch (error) {
            next(error);
        }
    }

    async deleteCustomer(req, res, next) {
        try {
            const { id } = req.params;

            await customerServices.deleteCustomer(id);

            return successResponse(
                res,
                "Customer deleted successfully"
            )
        } catch (error) {
            next(error);
        }
    }
}

export default new CustomerController();