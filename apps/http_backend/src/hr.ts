import express, {Router } from "express"
export const hrroutes:Router=express.Router()
hrroutes.post("/signup",(req,res)=>{
    res.json({message:"HR signed up"})
})
hrroutes.post("/signin",(req,res)=>{
    res.json({message:"HR signed in"})
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
