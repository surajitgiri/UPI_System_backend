import { loadProto, createGrpcClient, grpcCall } from "../client.js";

import { CUSTOMER_GRPC_ADDRESS } from "../../config/grpc.js";

// Load Customer Proto
const customerProto = loadProto("customer.proto");

// Create Customer gRPC Client
const customerClient = createGrpcClient(
    customerProto.customer.CustomerService,
    CUSTOMER_GRPC_ADDRESS
);

// Create Customer
const createCustomer = async (data) => {
    const response = await grpcCall(customerClient, "createCustomer",
        {
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            phone: data.phone || "",
            dateOfBirth: data.dateOfBirth || "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "",
            pincode: data.pincode || "",
        }
    );
    return response.data;
};

// Get All Customers
const getCustomers = async () => {
    const response = await grpcCall(
        customerClient,
        "getCustomers",
        {}
    );

    return response.data || [];
};

// Get Customer By ID
const getCustomerById = async (id) => {
    const response = await grpcCall(
        customerClient,
        "getCustomerById",
        {
            id,
        }
    );

    return response.data;
};

// Update Customer
const updateCustomer = async (id, data) => {
    const request = { id };

    // Only send fields provided by the client
    if (data.firstName !== undefined) {
        request.firstName = data.firstName;
    }

    if (data.lastName !== undefined) {
        request.lastName = data.lastName;
    }

    if (data.email !== undefined) {
        request.email = data.email;
    }

    if (data.phone !== undefined) {
        request.phone = data.phone;
    }

    if (data.dateOfBirth !== undefined) {
        request.dateOfBirth = data.dateOfBirth;
    }

    if (data.address !== undefined) {
        request.address = data.address;
    }

    if (data.city !== undefined) {
        request.city = data.city;
    }

    if (data.state !== undefined) {
        request.state = data.state;
    }

    if (data.country !== undefined) {
        request.country = data.country;
    }

    if (data.pincode !== undefined) {
        request.pincode = data.pincode;
    }

    const response = await grpcCall(
        customerClient,
        "updateCustomer",
        request
    );

    return response.data;
};

// Delete Customer
const deleteCustomer = async (id) => {
    const response = await grpcCall(
        customerClient,
        "deleteCustomer",
        {
            id,
        }
    );

    return response;
};

// Export Customer Client
export default {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
};