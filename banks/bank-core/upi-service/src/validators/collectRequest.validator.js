import { z } from "zod";

const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;

// ─────────────────────────────────────────────
// Create a collect request (pull payment)
// Initiator requests money from target
// ─────────────────────────────────────────────
export const createCollectSchema = z.object({
    initiatorVpa: z
        .string()
        .regex(vpaRegex, "Invalid initiator VPA format"),

    targetVpa: z
        .string()
        .regex(vpaRegex, "Invalid target VPA format"),

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

    // How many hours until this collect expires (max 48h per NPCI)
    expiresInHours: z
        .number()
        .int()
        .min(1)
        .max(48)
        .default(24),
}).refine(
    (data) => data.initiatorVpa !== data.targetVpa,
    { message: "Initiator and target VPA cannot be the same", path: ["targetVpa"] }
);

// ─────────────────────────────────────────────
// Approve collect request (target pays)
// PIN required
// ─────────────────────────────────────────────
export const approveCollectSchema = z.object({
    upiPin: z
        .string()
        .regex(/^\d{4}$|^\d{6}$/, "UPI PIN must be 4 or 6 digits"),
});
