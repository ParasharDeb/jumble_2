import express, {Router } from "express"
import { userSignupSchema,userLoginSchema,userUpdateSchema, jobSchema} from "./types"
import bcrypt from "bcrypt"
import { prismaclient } from "@repo/db/client"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./config"
import { authmiddleware } from "./middleware"
import { AuthenticatedRequest } from "./interfaces"
export const hrroutes:Router=express.Router()
hrroutes.post("/signup",async(req,res)=>{
    const parseddata = userSignupSchema.safeParse(req.body)
    if(!parseddata.success){
        res.json({
            message:"Invalid data",
        })
        return
    }
    const hr = await prismaclient.hR.findFirst({
        where: {
            email: parseddata.data.email,
        },
    })
    if(hr){
        res.json({
            message:"email already exists",
        })
        return
    }
    const hashedPassword =await bcrypt.hash(parseddata.data.password, 10);
    try {
        await prismaclient.hR.create({
            data: {
                firstname: parseddata.data.firstname,
                lastname: parseddata.data.lastname,
                email: parseddata.data.email,
                password: hashedPassword,
            },
        })
    } catch (error) {
        res.json({
            message:"Error creating HR",
        })
        return
    }
    res.json({message:"HR signed up"})
})
hrroutes.post("/signin",async (req,res)=>{
    const parseddata = userLoginSchema.safeParse(req.body)
    if(!parseddata.success){
        res.json({
            message:"Invalid data",
        })
        return
    }
    const hr = await prismaclient.hR.findFirst({
        where: {
            email: parseddata.data.email,
        },
    })
    if(!hr){
        res.json({
            message:"wrong email",
        })
        return
    }
    const isPasswordValid = await bcrypt.compare(parseddata.data.password, hr.password);
    if(!isPasswordValid){
        res.json({
            message:"wrong password",
        })
        return
    }
    const token = jwt.sign({id: hr.id}, JWT_SECRET);
    res.json({
        message:"HR signed in successfully",
        token: token,
    })
})
hrroutes.put("/change_password",authmiddleware,async(req,res)=>{
    const parseddata = userUpdateSchema.safeParse(req.body)
    if(!parseddata.success){    
        res.json({
            message:"Invalid data",
        })
        return
    }
    const userId = (req as unknown as AuthenticatedRequest).userId;
    if(!userId){
        res.json({
            message:"User not authenticated",
        })
        return
    }
    const user = await prismaclient.hR.findUnique({
        where: {
            id: userId,
        },
    })
    if(!user){
        res.json({
            message:"User not found",
        })
        return
    }
    const passwordcheck=await bcrypt.compare(parseddata.data.oldpassword, user.password);
    if(!passwordcheck){
        res.json({
            message:"Old password is incorrect",
        })
        return
    }
    const hashedPassword = await bcrypt.hash(parseddata.data.newPassword, 10);
    await prismaclient.hR.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedPassword,
        },
    })
    res.json({message:"password updated"})
})
hrroutes.get("/profile",authmiddleware,async(req,res)=>{
    const userId = (req as unknown as AuthenticatedRequest).userId;
    if(!userId){
        res.json({
            message:"User not authenticated",
        })
        return
    }
    const user = await prismaclient.hR.findUnique({
        where: {
            id: userId,
        },
        include: {
            jobs: true,
        },
    })
    res.json({user})

})
hrroutes.post("/create_job",authmiddleware,async(req,res)=>{
    const parseddata= jobSchema.safeParse(req.body);
    if(!parseddata.success){
        res.json({
            message:"invalid input"
        })
        return
    }
    const userId=(req as unknown as AuthenticatedRequest).userId
    console.log("User ID from request:", userId);
    if(!userId){
        res.json({
            message:"you are not signed in"
        })
        return
    }
    try {
        await prismaclient.jobs.create({
        data:{
            role:parseddata.data.role,
            description:parseddata.data.description,
            location:parseddata.data.location,
            salary:parseddata.data.salary,
            experience:parseddata.data.experience,
            company:parseddata.data.company,
            HRId:userId
        }
    
    })
    res.json({
        message:"successfully created a job"
    })
    } catch (error) {
        res.json({
            message:error
        })
    }
    res.json({message:"Job created"})
})
hrroutes.get("/jobs",authmiddleware,async(req,res)=>{
    const userId=(req as unknown as AuthenticatedRequest).userId
    if(!userId){
        res.json({
            message:"you are not signed in"
        })
    }
    const jobs = await prismaclient.jobs.findFirst({
        where:{
            id:userId
        }
    })
    if(!jobs){
        res.json({
            message:"cannot find the user"
        })
        return
    }
    res.json(jobs)
})
//need to figure out these endpoints
hrroutes.get("/jobs/:id",(req,res)=>{
    res.json({message:`Job details for job with id ${req.params.id}`})
})

hrroutes.get("/applied_users/:jobId",(req,res)=>{
    res.json({message:`Users applied for job with id ${req.params.jobId}`})
})
hrroutes.get("/applied_users/:jobId/:userId",(req,res)=>{
    res.json({message:`Details of user with id ${req.params.userId} for job with id ${req.params.jobId}`})
})
hrroutes.post("/update_job/:id",(req,res)=>{
    res.json({message:`Job with id ${req.params.id} updated`})
})
