import customerService from "../services/customer.services.js";

const formatCustomer = (customer) => {
    if (!customer) return null;

    const primaryAddr = Array.isArray(customer.addresses) && customer.addresses.length > 0
        ? customer.addresses[0]
        : {};

    return {
        id: customer.id || "",
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phone: customer.phone || "",
        dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth).toISOString() : "",
        address: primaryAddr.line1 || customer.address || "",
        city: primaryAddr.city || customer.city || "",
        state: primaryAddr.state || customer.state || "",
        country: primaryAddr.country || customer.country || "",
        pincode: primaryAddr.pincode || customer.pincode || "",
        createdAt: customer.createdAt ? new Date(customer.createdAt).toISOString() : "",
        updatedAt: customer.updatedAt ? new Date(customer.updatedAt).toISOString() : "",
    };
};

export default {
    async createCustomer(call, callback) {
        try {
            const customer = await customerService.createCustomer(call.request);
            callback(null, {
                success: true,
                message: "Customer created successfully",
                data: formatCustomer(customer)
            });
        } catch (error) {
            callback(null, {
                success: false,
                message: error.message || "Failed to create customer",
                data: null
            });
        }
    },

    async getCustomers(call, callback) {
        try {
            const customers = await customerService.getAllCustomers();
            callback(null, {
                success: true,
                message: "Customers retrieved successfully",
                data: (customers || []).map(formatCustomer)
            });
        } catch (error) {
            callback(null, {
                success: false,
                message: error.message || "Failed to retrieve customers",
                data: []
            });
        }
    },

    async getCustomerById(call, callback) {
        try {
            const id = call.request.id || call.request.customerId;
            const customer = await customerService.getCustomerById(id);
            callback(null, {
                success: true,
                message: "Customer retrieved successfully",
                data: formatCustomer(customer)
            });
        } catch (error) {
            callback(null, {
                success: false,
                message: error.message || "Customer not found",
                data: null
            });
        }
    },

    async updateCustomer(call, callback) {
        try {
            const { id, ...data } = call.request;
            const customer = await customerService.updateCustomer(id, data);
            callback(null, {
                success: true,
                message: "Customer updated successfully",
                data: formatCustomer(customer)
            });
        } catch (error) {
            callback(null, {
                success: false,
                message: error.message || "Failed to update customer",
                data: null
            });
        }
    },

    async deleteCustomer(call, callback) {
        try {
            const id = call.request.id;
            await customerService.deleteCustomer(id);
            callback(null, {
                success: true,
                message: "Customer deleted successfully"
            });
        } catch (error) {
            callback(null, {
                success: false,
                message: error.message || "Failed to delete customer"
            });
        }
    }
};