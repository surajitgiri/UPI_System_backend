import { object, z } from "zod";

// VPA format: localpart@handle
// e.g. suraj@okicici, 9876543210@ybl, name@upi

const vpaRegx = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;

// Create VPA
export const createVpaSChema = z.object({
    vpa: z.string().min(3, "VPA must be at least 3 characters").regex(vpaRegx, "Invalid VPA format. Expected format: name@handle (e.g. suraj@okicici)"),
    userId: z.string().uuid("userId must be a valid UUID"),
    accountId: z.string().uuid("accountId must be a valid UUID"),
    bankCode: z.string().min(2, "bankCode is required").max(20),
    isPrimary: z.boolean().optional().default(false),
    isDefault: z.boolean().optional().default(false),
    remarks: z.string().max(255).optional(),
});

// Update VPA (only safe fields)
// Balance/status changes go through dedicated endpoints

export const updateVpaSchema = z.object({
    isPrimary: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    remarks: z.string().max(255).optional(),
}).refine((data) =>
    Object.keys(data).length > 0,
    { message: "At least one field must be provided to update" }
);

// Set / Change UPI PIN
// PIN is 4 or 6 digits (as per NPCI spec)
export const setPinSchema = z.object({
    pin: z.string().regex(/^\d{4}$|^\d{6}$/, "UPI PIN must be exactly 4 or 6 digits"),
    // Required to authenticate the request before allowing PIN change

    accountNumber: z.string().min(9, "Account number is required"),
    expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Expiry date must be in MM/YY format"),
});


// ─────────────────────────────────────────────
// Verify UPI PIN
// ─────────────────────────────────────────────
export const verifyPinSchema = z.object({
    pin: z.string().regex(/^\d{4}$|^\d{6}$/, "UPI PIN must be exactly 4 or 6 digits")
});