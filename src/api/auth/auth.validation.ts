import { z } from 'zod';

// Skema untuk registrasi kasir baru
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

// Skema untuk login kasir
export const loginSchema = z.object({
  body: z.object({
    email: z.email('Invalid email address'),
    password: z.string(),
  }),
});

export type IRegisterInput = z.infer<typeof registerSchema>['body'];
export type ILoginInput = z.infer<typeof loginSchema>['body'];