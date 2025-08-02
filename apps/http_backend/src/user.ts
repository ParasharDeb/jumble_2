import expres, {Router} from "express"
import { detailsSchema, userLoginSchema, userSignupSchema } from "./types"
import { prismaclient } from "@repo/db/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { authmiddleware } from "./middleware"
import { JWT_SECRET } from "./config"
import { AuthenticatedRequest } from "./interfaces"



export const userroutes:Router=expres.Router()

userroutes.post("/signup",async(req,res)=>{
    const parseddata=userSignupSchema.safeParse(req.body)
    if(!parseddata.success){    
        res.json({
            message:"Invalid data",
        })
        return
    }
    const user = await prismaclient.user.findFirst({
        where: {
            email: parseddata.data.email,
        },
    })
    if(user){
        res.json({
            message:"User already exists",
        })
        return
    }
    const hashedPassword = await bcrypt.hash(parseddata.data.password, 10);
    try {
        
        await prismaclient.user.create({
        data: {
            firstname: parseddata.data.firstname,
            lastname: parseddata.data.lastname,
            email: parseddata.data.email,
            password: hashedPassword,
        },
    })
    res.json({
        message:"User signed up successfully",
    })
    } catch (error) {
        res.json({
            message:"Error creating user", })
    }
    
})
userroutes.post("/signin",async(req,res)=>{
    const parseddata=userLoginSchema.safeParse(req.body)
    if(!parseddata.success){
        res.json({
            message:"Invalid data",
        })
        return
    }   
    const user = await prismaclient.user.findFirst({
        where: {
            email: parseddata.data.email
        },
    })
    if(!user){
        res.json({
            message:"User does not exist",
        })
        return
    }
    const passwordcheck = await bcrypt.compare(parseddata.data.password, user.password);
    if(!passwordcheck){
        res.json({
            message:"Invalid password",
        })
        return
    }
    const token = jwt.sign({ userId: user.id  },JWT_SECRET )
    res.json({
        message:"User signed in successfully",
        token: token,
    })
})
userroutes.post("/details",authmiddleware,async(req,res)=>{
    const userId = (req as unknown as AuthenticatedRequest).userId;
    const parseddata=detailsSchema.safeParse(req.body)
    if(!parseddata.success){    
        res.json({
            message:"Invalid data",
        })
        return
    }
    await prismaclient.details.create({
        data: {
            resume: parseddata.data.resume,
            linkedin: parseddata.data.linkedin,
            github: parseddata.data.github,
            portfolio: parseddata.data.portfolio,
            userId: req.body.userId, 
        },
    })
})    
userroutes.get("/profile",(req,res)=>{
    const userId = (req as unknown as AuthenticatedRequest).userId;
    if(!userId){
        res.json({
            message:"User not authenticated",
        })
        return
    }
    const user = prismaclient.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            details: true,
        },
    })
    res.json({user})
})
userroutes.put("/profile",(req,res)=>{
    res.json({message:"User profile updated"})
})
userroutes.post("/upload_resume",(req,res)=>{
    res.json({message:`for uploading resume`})
})
userroutes.get("/jobs",(req,res)=>{
    res.json({message:"User jobs"})
})
userroutes.post("/apply",(req,res)=>{
    res.json({message:"User applied for job"})
})
userroutes.get("/appliedjobs",(req,res)=>{
    res.json({message:"User applied jobs"})
})
userroutes.get("/appliedjobs/:id",(req,res)=>{
    res.json({message:`User applied job with id ${req.params.id}`})
})
