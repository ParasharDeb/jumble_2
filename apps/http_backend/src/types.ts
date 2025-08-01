import z, { email } from "zod";
export const userLoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
export const userSignupSchema = userLoginSchema.extend({
    firstname: z.string().min(1, "First name is required"), 
    lastname: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"), 
});