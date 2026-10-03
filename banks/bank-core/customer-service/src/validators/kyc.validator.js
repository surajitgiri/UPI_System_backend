import { z } from "zod"

export const createKycSchema = z.object({
    aadhaarNumber: z.string().regex(/^[0-9]{12}$/, "Invalid Aadhaar number"),
    panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"),
    passportNumber: z.string().optional(),
    voterId: z.string().optional(),
    drivingLicense: z.string().optional(),
})

export const updateKycSchema = createKycSchema.partial();