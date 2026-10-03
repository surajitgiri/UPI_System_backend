import Joi from "joi"

// Create Ledger Entry
export const createLedgerEntrySchema = Joi.object({
    transactionId: Joi.string()
        .uuid()
        .required()
        .message({
            "string.empty": "Transaction ID is required",
            "string.guid": "Transaction ID must be a valid UUID",
            "any.required": "Transaction ID is required",
        }),

    accountId: Joi.string()
        .uuid()
        .required()
        .message({
            "string.empty": "Account ID is required",
            "string.guid": "Account ID must be a valid UUID",
            "any.required": "Account ID is required",
        }),

    entryType: Joi.string()
        .valid("DEBIT", "CREDIT")
        .required()
        .message({
            "any.only": "Entry type must be either DEBIT or CREDIT",
            "any.required": "Entry type is required",
        }),

    amount: Joi.number()
        .positive()
        .precision(2)
        .required()
        .message({
            "number.base": "Amount must be a number",
            "number.positive": "Amount must be greater than zero",
            "any.required": "Amount is required",
        }),

    currency: Joi.string()
        .length(3)
        .uppercase()
        .default("INR")
        .message({
            "string.length": "Currency must be a 3-letter currency code",
        }),

    description: Joi.string()
        .trim()
        .max(500)
        .allow("", null)
        .optional(),

    reference: Joi.string()
        .trim()
        .max(100)
        .allow("", null)
        .optional(),

    balanceBefore: Joi.number()
        .min(0)
        .precision(2)
        .required(),

    balanceAfter: Joi.number()
        .min(0)
        .precision(2)
        .required(),
});


//Get Ledger Entry By ID
export const ledgerIdSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .message({
            "string.guid": "Ledger ID must be a valid UUID",
            "any.required": "Ledger ID is required",
        }),
});

//Get Ledger By Account ID
export const accountLedgerSchema = Joi.object({
    accountId: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.guid": "Account ID must be a valid UUID",
            "any.required": "Account ID is required",
        }),
});


//Get Ledger By Transaction ID
export const transactionLedgerSchema = Joi.object({
    transactionId: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.guid": "Transaction ID must be a valid UUID",
            "any.required": "Transaction ID is required",
        }),
});

//Reverse Ledger Entry
export const reverseLedgerSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            "string.guid": "Ledger ID must be a valid UUID",
            "any.required": "Ledger ID is required",
        }),

    reason: Joi.string()
        .trim()
        .min(3)
        .max(500)
        .required()
        .messages({
            "string.min": "Reversal reason must contain at least 3 characters",
            "string.max": "Reversal reason cannot exceed 500 characters",
            "any.required": "Reversal reason is required",
        }),
});