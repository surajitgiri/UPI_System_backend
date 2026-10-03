import { z } from "zod";

export const createCustomerSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name cannot exceed 50 characters"),

    middleName: z
        .string()
        .trim()
        .max(50)
        .optional(),

    lastName: z
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name cannot exceed 50 characters"),

    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .toLowerCase(),

    phone: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Phone number must be a valid Indian mobile number"),

    dateOfBirth: z
        .string()
        .datetime({ offset: true })
        .or(z.string().date()),

    gender: z.enum(["MALE", "FEMALE", "OTHER"]),

    occupation: z
        .string()
        .trim()
        .max(100)
        .optional(),

    annualIncome: z
        .number()
        .nonnegative("Annual income cannot be negative")
        .optional(),

    maritalStatus: z
        .enum([
            "SINGLE",
            "MARRIED",
            "DIVORCED",
            "WIDOWED"
        ])
        .optional()
});

export const updateCustomerSchema =
    createCustomerSchema.partial();