// Account Validator

const validateRequired = (value) => {
    return value !== undefined &&
        value !== null &&
        String(value).trim() !== "";
};

// Create Account
// POST /api/v1/accounts
const createAccountValidator = async (req) => {
    const {
        accountNumber,
        customerId,
        branchId,
        accountType,
        availableBalance,
        currency,
    } = req.body;

    const errors = [];

    if (!validateRequired(accountNumber)) {
        errors.push({
            field: "accountNumber",
            message: "Account number is required",
        });
    }

    if (!validateRequired(customerId)) {
        errors.push({
            field: "customerId",
            message: "Customer ID is required",
        });
    }

    if (!validateRequired(branchId)) {
        errors.push({
            field: "branchId",
            message: "Branch ID is required",
        })
    }

    if (!validateRequired(accountType)) {
        errors.push({
            field: "accountType",
            message: "Account type is required",
        });
    }

    if (availableBalance === undefined || availableBalance === null) {
        errors.push({
            field: "availableBalance",
            message: "Available balance is required",
        });
    } else if (Number.isNaN(Number(availableBalance))) {
        errors.push({
            field: "availableBalance",
            message: "Available balance must be a valid number",
        });
    } else if (Number(availableBalance) < 0) {
        errors.push({
            field: "availableBalance",
            message: "Available balance cannot be negative",
        });
    }

    if (currency !== undefined && currency !== null) {
        if (typeof currency !== "string" || currency.length !== 3) {
            errors.push({
                field: "currency",
                message: "Currency must be a 3-character code",
            });
        }
    }

    if (errors.length > 0) {
        return {
            valid: false,
            errors,
        };
    }

    return {
        valid: true,
        date: req.body,
    };
};

//  Update Account
// PATCH /api/v1/accounts/:id
const updateAccountValidator = async (req) => {
    const {
        accountNumber,
        customerId,
        branchId,
        accountType,
        currency,
        availableBalance,
        holdBalance,
        minimumBalance,
    } = req.body;

    const errors = [];

    if (accountNumber !== undefined && !validateRequired(accountNumber)) {
        errors.push({
            field: "accountNumber",
            message: "Account number cannot be empty",
        });
    }

    if (customerId !== undefined && !validateRequired(customerId)) {
        errors.push({
            field: "customerId",
            message: "Customer ID cannot be empty",
        });
    }

    if (branchId !== undefined && !validateRequired(branchId)) {
        errors.push({
            field: "branchId",
            message: "Branch ID cannot be empty",
        });
    }

    if (accountType !== undefined && !validateRequired(accountType)) {
        errors.push({
            field: "accountType",
            message: "Account type cannot be empty",
        });
    }

    if (currency !== undefined) {
        if (
            typeof currency !== "string" ||
            currency.length !== 3
        ) {
            errors.push({
                field: "currency",
                message: "Currency must be a 3-character code",
            });
        }
    }

    const balanceFields = [
        "availableBalance",
        "holdBalance",
        "minimumBalance",
    ];

    for (const field of balanceFields) {
        const value = req.body[field];

        if (value !== undefined) {
            if (Number.isNaN(Number(value))) {
                errors.push({
                    field,
                    message: `${field} must be a valid number`,
                });
            } else if (Number(value) < 0) {
                errors.push({
                    field,
                    message: `${field} cannot be negative`,
                });
            }
        }
    }

    if (errors.length > 0) {
        return {
            valid: false,
            errors,
        };
    }

    return {
        valid: true,
        data: req.body,
    };
};

// Account ID Validator
const accountIdValidator = async (req) => {
    const { id } = req.params;

    const errors = [];

    if (!validateRequired(id)) {
        errors.push({
            field: "id",
            message: "Account ID is required",
        });
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};

// Account Number Validator
const accountNumberValidator = async (req) => {
    const { accountNumber } = req.params;

    const errors = [];

    if (!validateRequired(accountNumber)) {
        errors.push({
            field: "accountNumber",
            message: "Account number is required",
        });
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};

export default {
    createAccountValidator,
    updateAccountValidator,
    accountIdValidator,
    accountNumberValidator
}