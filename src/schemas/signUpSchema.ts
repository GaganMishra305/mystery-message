import {z} from "zod";

export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/ ,'username must nto contain special characters')

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
})