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
export const userUpdateSchema = z.object({
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
    oldpassword: z.string().min(6, "Old password must be at least 6 characters long"),
})
export const detailsSchema = z.object({
    resume: z.url("Invalid URL format for resume").optional(),
    linkedin: z.url("Invalid URL format for LinkedIn profile"),
    github: z.url("Invalid URL format for GitHub profile"),
    portfolio: z.url("Invalid URL format for portfolio"),
    bio: z.string().min(1, "Bio is required"),
    location: z.string().min(1, "Location is required"),
    phone: z.string().min(10, "Phone number must be at least 10 characters long"),
    
})