import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_HOST: z.string().min(1, 'DATABASE_HOST is required'),
  DATABASE_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), 'DATABASE_PORT must be a valid number'),
  DATABASE_USER: z.string().min(1, 'DATABASE_USER is required'),
  DATABASE_PASSWORD: z.string().min(1, 'DATABASE_PASSWORD is required'),
  DATABASE_NAME: z.string().min(1, 'DATABASE_NAME is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
});
