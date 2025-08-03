import express, {Router } from "express"
import { userSignupSchema } from "./types"
import bcrypt from "bcrypt"
import { prismaclient } from "@repo/db/client"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./config"
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
hrroutes.put("/profile",(req,res)=>{
    res.json({message:"HR profile updated"})
})
hrroutes.get("/profile",(req,res)=>{
    res.json({message:"HR profile"})
})
hrroutes.post("/create_job",(req,res)=>{
    res.json({message:"Job created"})
})
hrroutes.get("/jobs",(req,res)=>{
    res.json({message:"HR jobs"})
})
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
