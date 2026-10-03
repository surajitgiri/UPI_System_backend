import { z } from "zod";

const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;

// ─────────────────────────────────────────────
// Initiate a PAY transaction (push payment)
// Sender → Receiver
// ─────────────────────────────────────────────
export const initiatePaySchema = z.object({
    senderVpa: z
        .string()
        .regex(vpaRegex, "Invalid sender VPA format"),

    receiverVpa: z
        .string()
        .regex(vpaRegex, "Invalid receiver VPA format"),

    amount: z
        .number()
        .positive("Amount must be greater than zero")
        .multipleOf(0.01, "Amount can have at most 2 decimal places"),

    currency: z
        .string()
        .length(3)
        .default("INR"),

    description: z
        .string()
        .max(100)
        .optional(),

    remarks: z
        .string()
        .max(255)
        .optional(),

    upiPin: z
        .string()
        .regex(/^\d{4}$|^\d{6}$/, "UPI PIN must be 4 or 6 digits"),
}).refine(
    (data) => data.senderVpa !== data.receiverVpa,
    { message: "Sender and receiver VPA cannot be the same", path: ["receiverVpa"] }
);

// ─────────────────────────────────────────────
// Refund transaction
// ─────────────────────────────────────────────
export const initiateRefundSchema = z.object({
    originalTransactionId: z
        .string()
        .uuid("originalTransactionId must be a valid UUID"),

    amount: z
        .number()
        .positive("Refund amount must be greater than zero")
        .optional(), // if omitted → full refund

    remarks: z
        .string()
        .max(255)
        .optional(),
});
