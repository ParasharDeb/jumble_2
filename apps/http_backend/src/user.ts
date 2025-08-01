import expres, {Router} from "express"
export const userroutes:Router=expres.Router()
userroutes.post("/signup",(req,res)=>{

})
userroutes.post("/signin",(req,res)=>{
})
userroutes.get("/profile",(req,res)=>{
    res.json({message:"User profile"})
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
