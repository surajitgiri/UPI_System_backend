import crypto from "crypto";

// Generate a unique transaction reference.

//  * Example:
//  * TXN-20260814-A7F92C31D4
export const generateTransactionReference = () => {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    const randomPart = crypto
        .randomBytes(5)
        .toString("hex")
        .toUpperCase();

    return `TXN-${year}${month}${day}-${randomPart}`;
};

// Validate transaction amount.
export const isValidAmount = (amount) => {
    if (amount === undefined || amount === null) {
        return false;
    }

    const numericAmount = Number(amount);

    return (
        Number.isFinite(numericAmount) &&
        numericAmount > 0
    );
};


//  Convert amount to fixed 2 decimal places.
//  *
//  * Example:
//  * 1000 -> "1000.00"
export const formatAmount = (amount) => {
    return Number(amount).toFixed(2);
};

// Check whether transaction is a transfer.
export const isTransfer = (type) => {
    return type === "TRANSFER";
}

//Check whether transaction is a deposit.
export const isDeposit = (type) => {
    return type === "DEPOSIT";
};

//Check whether transaction is a withdrawal.
export const isWithdrawal = (type) => {
    return type === "WITHDRAWAL";
};

//Check whether transaction can be processed.
export const canProcessTransaction = (status) => {
    return (
        status === "PENDING" ||
        status === "PROCESSING"
    );
};

//Check whether transaction is completed.
export const isSuccessfulTransaction = (status) => {
    return status === "SUCCESS";
};

//Check whether transaction has failed.
export const isFailedTransaction = (status) => {
    return status === "FAILED";
};

//Check whether transaction has been reversed.
export const isReversedTransaction = (status) => {
    return status === "REVERSED";
};