//HTTP Status Codes

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,

    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};


// API Messages

export const API_MESSAGES = {
    SUCCESS: "Request successful",
    CREATED: "Resource created successfully",
    UPDATED: "Resource updated successfully",
    DELETED: "Resource deleted successfully",

    BAD_REQUEST: "Bad request",
    UNAUTHORIZED: "Authentication required",
    FORBIDDEN: "Access denied",
    NOT_FOUND: "Resource not found",
    INTERNAL_SERVER_ERROR: "Internal server error",

    SERVICE_UNAVAILABLE: "Service temporarily unavailable",
};


// Service Names


export const SERVICES = {
    CUSTOMER: "customer-service",
    ACCOUNT: "account-service",
    TRANSACTION: "transaction-service",
    LEDGER: "ledger-service",
};



// Transaction Types


export const TRANSACTION_TYPES = {
    TRANSFER: "TRANSFER",
    DEPOSIT: "DEPOSIT",
    WITHDRAWAL: "WITHDRAWAL",
};



// Transaction Status


export const TRANSACTION_STATUS = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    REVERSED: "REVERSED",
};



// Account Status


export const ACCOUNT_STATUS = {
    ACTIVE: "ACTIVE",
    FROZEN: "FROZEN",
    CLOSED: "CLOSED",
};



// Account Types


export const ACCOUNT_TYPES = {
    SAVINGS: "SAVINGS",
    CURRENT: "CURRENT",
};