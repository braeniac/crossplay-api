import { z } from 'zod'; 

export const PlatformEnum = z.enum(["spotify", "youtube", "apple"]);

export type platform = z.infer<typeof PlatformEnum>

export const PlatformParamsSchema = z.object({
    platform : PlatformEnum
})