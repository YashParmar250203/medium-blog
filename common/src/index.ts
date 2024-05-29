import z from "zod"

//------------------------------signup input-----------------------------------------------------------
export const signupInput = z.object({
    email : z.string().email(),
    password : z.string().min(6),
    name : z.string().optional()
})

export type SingupInput = z.infer<typeof signupInput>

// ------------------------------sign in zod below----------------------------------------------------------

export const signinInput = z.object({
    email : z.string().email(),
    password : z.string().min(6)
})

export type SinginInput = z.infer<typeof signinInput>


// ------------------------------blog input----------------------------------------------------------

export const createBlogInput = z.object({
    title : z.string(),
    content : z.string()
})

export type CreateBlogInput = z.infer<typeof createBlogInput>


// ------------------------------blog update----------------------------------------------------------

export const updateBlogInput = z.object({
    title : z.string(),
    content : z.string(),
    id : z.string()
})

export type UpdateBlogInput = z.infer<typeof updateBlogInput>