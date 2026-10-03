import { randomUUID } from "crypto";

import CustomerRepository from "../repositories/customer/customer.repository.js";
import generateCustomerNumber from "../utils/customerNumber.js";

import NotFoundError from "../errors/NotFoundError.js";
import ValidationError from "../errors/ValidationError.js";

class CustomerService {
    // generateCustomerNumber() {
    //     return (
    //         "CUST" +
    //         Date.now().toString().slice(-8) +
    //         Math.floor(Math.random() * 10000)
    //             .toString()
    //             .padStart(3, "0")
    //     );
    // }

    async createCustomer(data) {
        const existingEmail = await CustomerRepository.findByEmail(data.email);

        if (existingEmail) {
            throw new ValidationError("Email Already Exists");
        }

        const existingPhone = await CustomerRepository.findByPhone(data.phone);

        if (existingPhone) {
            throw new ValidationError("Phone Number Already Exists");
        }

        const customer = {
            id: randomUUID(),
            customerNumber: generateCustomerNumber(),
            ...data
        }

        return await CustomerRepository.create(customer);
    }

    async getAllCustomers() {
        return await CustomerRepository.findAll();
    }

    async getCustomerById(id) {
        const customer = await CustomerRepository.findById(id);

        if (!customer) {
            throw new NotFoundError("Customer Not Found");
        }

        return customer;
    }

    async updateCustomer(id, data) {
        await this.getCustomerById(id);

        return await CustomerRepository.update(id, data);
    }

    async deleteCustomer(id) {
        await this.getCustomerById(id);

        return await CustomerRepository.delete(id);
    }

    async getCustomerByCustomerNumber(customerNumber) {
        const customer = await CustomerRepository.findByCustomerNumber(
            customerNumber
        );

        if (!customer) {
            throw new NotFoundError("Customer not found")
        }
        return customer;
    }
}

export default new CustomerService();