import { z } from 'zod'

export const profileSchema = z.object({
  displayName: z.string().trim().min(1, 'Username is required').max(50),
})
