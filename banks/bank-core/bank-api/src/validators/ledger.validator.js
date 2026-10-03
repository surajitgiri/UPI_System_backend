/*
|--------------------------------------------------------------------------
| Ledger Validator
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
| Ledger ID
|--------------------------------------------------------------------------
*/

const ledgerIdValidator = async (req) => {
    const { id } = req.params;

    const errors = [];

    if (!validateRequired(id)) {
        errors.push({
            field: "id",
            message: "Ledger ID is required",
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
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};


/*
|--------------------------------------------------------------------------
| Transaction ID
|--------------------------------------------------------------------------
*/

const transactionIdValidator = async (req) => {
    const { transactionId } = req.params;

    const errors = [];

    if (!validateRequired(transactionId)) {
        errors.push({
            field: "transactionId",
            message: "Transaction ID is required",
        });
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};


/*
|--------------------------------------------------------------------------
| Ledger Pagination
|--------------------------------------------------------------------------
| Example:
| GET /ledger/account/:accountId/paginated?page=1&limit=20
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
                message: "Page must be a positive integer",
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
                message: "Limit must be between 1 and 100",
            });
        }
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : null,
    };
};


export default {
    ledgerIdValidator,
    accountIdValidator,
    transactionIdValidator,
    paginationValidator,
};