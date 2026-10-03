import customerClient from "../grpc/clients/customer.client.js";

import { successResponse } from "../utils/response.js";

import AppError from "../errors/AppError.js";


class CustomerController {

    // POST /customers

    async createCustomer(req, res, next) {
        try {
            const customer =
                await customerClient.createCustomer(
                    req.body
                );

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


    //GET /customers

    async getCustomers(req, res, next) {
        try {
            const customers =
                await customerClient.getCustomers();

            return successResponse(
                res,
                "Customers fetched successfully",
                customers
            );
        } catch (error) {
            next(error);
        }
    }

    // GET /customers/:id

    async getCustomerById(req, res, next) {
        try {
            const { id } = req.params;

            const customer =
                await customerClient.getCustomerById(id);

            if (!customer) {
                throw new AppError(
                    "Customer not found",
                    404
                );
            }

            return successResponse(
                res,
                "Customer fetched successfully",
                customer
            );
        } catch (error) {
            next(error);
        }
    }

    //PATCH /customers/:id

    async updateCustomer(req, res, next) {
        try {
            const { id } = req.params;

            const customer =
                await customerClient.updateCustomer(
                    id,
                    req.body
                );

            if (!customer) {
                throw new AppError(
                    "Customer not found",
                    404
                );
            }

            return successResponse(
                res,
                "Customer updated successfully",
                customer
            );
        } catch (error) {
            next(error);
        }
    }

    // DELETE /customers/:id

    async deleteCustomer(req, res, next) {
        try {
            const { id } = req.params;

            await customerClient.deleteCustomer(id);

            return successResponse(
                res,
                "Customer deleted successfully",
                null
            );
        } catch (error) {
            next(error);
        }
    }
}


export default new CustomerController();