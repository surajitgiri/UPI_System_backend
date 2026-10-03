import { z } from "zod";

export const createBranchSchema = z.object({
    branchCode: z.string().min(2),

    branchName: z.string().min(3),

    ifscCode: z.string().min(11).max(11),

    address: z.string(),

    city: z.string(),

    state: z.string(),

    country: z.string(),

    pincode: z.string(),

    phone: z.string().optional(),

    email: z.string().email().optional(),

    managerName: z.string().optional(),
});

export const updateBranchSchema =
    createBranchSchema.partial();