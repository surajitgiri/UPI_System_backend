import { z } from "zod"

export const createAccountSchema = z.object({
    customerId: z.string().uuid(),

    branch: z.string().uuid(),

    accountType: z.enum([
        "SAVINGS",
        "CURRENT",
        "SALARY",
        "FIXED_DEPOSIT",
    ]),

    minimumBalance: z.number().nonnegative().optional(),

    currency: z.string().default("INR")
});

export const updateAccountSchema = createAccountSchema.partial();