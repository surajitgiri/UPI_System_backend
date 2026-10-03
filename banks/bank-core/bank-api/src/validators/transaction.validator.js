/*
|--------------------------------------------------------------------------
| Transaction Validator
|--------------------------------------------------------------------------
*/

const validateRequired = (value) => {
    return (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );
};


/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const TRANSACTION_TYPES = [
    "TRANSFER",
    "DEPOSIT",
    "WITHDRAWAL",
];

const TRANSACTION_STATUSES = [
    "PENDING",
    "PROCESSING",
    "SUCCESS",
    "FAILED",
    "REVERSED",
];


/*
|--------------------------------------------------------------------------
| UUID Validator
|--------------------------------------------------------------------------
|
| Your Prisma IDs use:
| @default(uuid())
|
|--------------------------------------------------------------------------
*/

const isValidUUID = (value) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        String(value)
    );
};


/*
|--------------------------------------------------------------------------
| Amount Validator
|--------------------------------------------------------------------------
*/

const validateAmount = (amount, field = "amount") => {
    const errors = [];

    if (
        amount === undefined ||
        amount === null ||
        amount === ""
    ) {
        errors.push({
            field,
            message: `${field} is required`,
        });

        return errors;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
        errors.push({
            field,
            message: `${field} must be a valid number`,
        });

        return errors;
    }

    if (numericAmount <= 0) {
        errors.push({
            field,
            message: `${field} must be greater than zero`,
        });
    }

    return errors;
};


/*
|--------------------------------------------------------------------------
| Create Transaction
|--------------------------------------------------------------------------
| POST /api/v1/transactions
|--------------------------------------------------------------------------
*/

const createTransactionValidator = async (req) => {
    const {
        type,
        sourceAccountId,
        destinationAccountId,
        amount,
        currency,
        description,
    } = req.body;

    const errors = [];


    /*
    |--------------------------------------------------------------------------
    | Transaction Type
    |--------------------------------------------------------------------------
    */

    if (!validateRequired(type)) {
        errors.push({
            field: "type",
            message: "Transaction type is required",
        });
    } else if (!TRANSACTION_TYPES.includes(type)) {
        errors.push({
            field: "type",
            message: `Transaction type must be one of: ${TRANSACTION_TYPES.join(
                ", "
            )}`,
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Source Account
    |--------------------------------------------------------------------------
    */

    if (!validateRequired(sourceAccountId)) {
        errors.push({
            field: "sourceAccountId",
            message: "Source account ID is required",
        });
    } else if (!isValidUUID(sourceAccountId)) {
        errors.push({
            field: "sourceAccountId",
            message: "Invalid source account ID",
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Destination Account
    |--------------------------------------------------------------------------
    */

    if (type === "TRANSFER") {
        if (!validateRequired(destinationAccountId)) {
            errors.push({
                field: "destinationAccountId",
                message:
                    "Destination account ID is required for transfer",
            });
        } else if (!isValidUUID(destinationAccountId)) {
            errors.push({
                field: "destinationAccountId",
                message: "Invalid destination account ID",
            });
        }

        if (
            sourceAccountId &&
            destinationAccountId &&
            sourceAccountId === destinationAccountId
        ) {
            errors.push({
                field: "destinationAccountId",
                message:
                    "Source and destination accounts cannot be the same",
            });
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Deposit
    |--------------------------------------------------------------------------
    */

    if (type === "DEPOSIT") {
        if (
            destinationAccountId !== undefined &&
            destinationAccountId !== null &&
            destinationAccountId !== ""
        ) {
            if (!isValidUUID(destinationAccountId)) {
                errors.push({
                    field: "destinationAccountId",
                    message: "Invalid destination account ID",
                });
            }
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Amount
    |--------------------------------------------------------------------------
    */

    errors.push(
        ...validateAmount(amount)
    );


    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    */

    if (currency !== undefined && currency !== null) {
        if (
            typeof currency !== "string" ||
            currency.length !== 3
        ) {
            errors.push({
                field: "currency",
                message:
                    "Currency must be a 3-character code",
            });
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Description
    |--------------------------------------------------------------------------
    */

    if (description !== undefined) {
        if (typeof description !== "string") {
            errors.push({
                field: "description",
                message: "Description must be a string",
            });
        } else if (description.length > 500) {
            errors.push({
                field: "description",
                message:
                    "Description cannot exceed 500 characters",
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
        data: req.body,
    };
};


/*
|--------------------------------------------------------------------------
| Transaction ID
|--------------------------------------------------------------------------
*/

const transactionIdValidator = async (req) => {
    const { id } = req.params;

    const errors = [];

    if (!validateRequired(id)) {
        errors.push({
            field: "id",
            message: "Transaction ID is required",
        });
    } else if (!isValidUUID(id)) {
        errors.push({
            field: "id",
            message: "Invalid transaction ID",
        });
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};


/*
|--------------------------------------------------------------------------
| Transaction Reference
|--------------------------------------------------------------------------
*/

const transactionReferenceValidator = async (req) => {
    const { reference } = req.params;

    const errors = [];

    if (!validateRequired(reference)) {
        errors.push({
            field: "reference",
            message: "Transaction reference is required",
        });
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};


/*
|--------------------------------------------------------------------------
| Account ID
|--------------------------------------------------------------------------
*/

const accountIdValidator = async (req) => {
    const { accountId } = req.params;

    const errors = [];

    if (!validateRequired(accountId)) {
        errors.push({
            field: "accountId",
            message: "Account ID is required",
        });
    } else if (!isValidUUID(accountId)) {
        errors.push({
            field: "accountId",
            message: "Invalid account ID",
        });
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};


/*
|--------------------------------------------------------------------------
| Transaction Status
|--------------------------------------------------------------------------
*/

const transactionStatusValidator = async (req) => {
    const { status } = req.params;

    const errors = [];

    if (!validateRequired(status)) {
        errors.push({
            field: "status",
            message: "Transaction status is required",
        });
    } else if (!TRANSACTION_STATUSES.includes(status)) {
        errors.push({
            field: "status",
            message: `Invalid transaction status. Allowed values: ${TRANSACTION_STATUSES.join(
                ", "
            )}`,
        });
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};


/*
|--------------------------------------------------------------------------
| Transaction Type
|--------------------------------------------------------------------------
*/

const transactionTypeValidator = async (req) => {
    const { type } = req.params;

    const errors = [];

    if (!validateRequired(type)) {
        errors.push({
            field: "type",
            message: "Transaction type is required",
        });
    } else if (!TRANSACTION_TYPES.includes(type)) {
        errors.push({
            field: "type",
            message: `Invalid transaction type. Allowed values: ${TRANSACTION_TYPES.join(
                ", "
            )}`,
        });
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};


/*
|--------------------------------------------------------------------------
| Failure Reason
|--------------------------------------------------------------------------
| PATCH /transactions/:id/failed
|--------------------------------------------------------------------------
*/

const failureValidator = async (req) => {
    const { failureReason } = req.body;

    const errors = [];

    if (!validateRequired(failureReason)) {
        errors.push({
            field: "failureReason",
            message: "Failure reason is required",
        });
    } else if (failureReason.length > 500) {
        errors.push({
            field: "failureReason",
            message:
                "Failure reason cannot exceed 500 characters",
        });
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};


/*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

const paginationValidator = async (req) => {
    const errors = [];

    const page = req.query.page;
    const limit = req.query.limit;

    if (page !== undefined) {
        const pageNumber = Number(page);

        if (
            !Number.isInteger(pageNumber) ||
            pageNumber < 1
        ) {
            errors.push({
                field: "page",
                message:
                    "Page must be a positive integer",
            });
        }
    }

    if (limit !== undefined) {
        const limitNumber = Number(limit);

        if (
            !Number.isInteger(limitNumber) ||
            limitNumber < 1 ||
            limitNumber > 100
        ) {
            errors.push({
                field: "limit",
                message:
                    "Limit must be between 1 and 100",
            });
        }
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};


export default {
    createTransactionValidator,
    transactionIdValidator,
    transactionReferenceValidator,
    accountIdValidator,
    transactionStatusValidator,
    transactionTypeValidator,
    failureValidator,
    paginationValidator,
};