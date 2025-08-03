import expres, {Router} from "express"
import { detailsSchema, userLoginSchema, userSignupSchema, userUpdateSchema } from "./types"
import { prismaclient } from "@repo/db/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { authmiddleware, upload } from "./middleware"
import { JWT_SECRET } from "./config"
import { AuthenticatedRequest } from "./interfaces"
import fs from "fs"
import { uploadCouldinary } from "./cloudinary"


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
    if(!userId){
        res.json({
            message:"User not authenticated",
        })
        return
    }
    console.log(parseddata.data,parseddata.error)
    if(!parseddata.success){    
        res.json({
            message:"Invalid data",
        })
        return
    }
    await prismaclient.details.create({
        data: {
            resume: parseddata.data.resume|| " ",
            linkedin: parseddata.data.linkedin,
            github: parseddata.data.github,
            portfolio: parseddata.data.portfolio,
            bio: parseddata.data.bio,
            location: parseddata.data.location,
            phone: parseddata.data.phone,
            userId: userId, 
        },
    })
    res.json({
        message:"User details created successfully",
    })
})    
//TODO:  need another endpoint to update user details
userroutes.get("/profile",authmiddleware,async(req,res)=>{
    const userId = (req as unknown as AuthenticatedRequest).userId;
    console.log("User ID from request:", userId);
    if(!userId){
        res.json({
            message:"User not authenticated",
        })
        return
    }
    const user =await prismaclient.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            details: true,
        },
    })
    res.json({user})
})
userroutes.put("/change_password",authmiddleware,async(req,res)=>{
    const userId = (req as unknown as AuthenticatedRequest).userId;
    const parseddata=userUpdateSchema.safeParse(req.body)
    if(!parseddata.success){
        res.json({
            message:"Invalid data",
        })
        return
    }
    if(!userId){
        res.json({
            message:"User not authenticated",
        })
        return
    }
    const user = await prismaclient.user.findUnique({
        where: {
            id: userId,
        },
    })
    if(!user){
        res.json({
            message:"User does not exist",
        })
        return
    }
    const passwordcheck = await bcrypt.compare(parseddata.data.oldpassword, user.password);
    if(!passwordcheck){
        res.json({
            message:"Invalid old password",
        })
    return}
    const hashedPassword = await bcrypt.hash(parseddata.data.newPassword, 10);
    await prismaclient.user.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedPassword,
        },
    })
    res.json({
        message:"Password changed successfully",
    })

})
//A Big TODO: need to add file type validation and size validation
//Also need to check how to return the file url after uploading to cloudinary
//
userroutes.post("/upload_resume",authmiddleware,upload.single("resume"),async(req,res)=>{
    const userId = (req as unknown as AuthenticatedRequest).userId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  console.log("File received:", {
    originalname: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    mimetype: req.file.mimetype
  });

  try {
    const cloudinaryResponse = await uploadCouldinary(req.file.path);
    
    if (!cloudinaryResponse) {
      console.error("Cloudinary upload failed - no response returned");
      return res.status(500).json({ message: "Failed to upload file to Cloudinary" });
    }
    console.log("Resume uploaded to Cloudinary:", cloudinaryResponse.secure_url);
    fs.unlinkSync(req.file.path);

    res.json({
      message: "Resume uploaded successfully",
      resumeUrl: cloudinaryResponse.secure_url
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }  
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: "Failed to upload resume",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

userroutes.get("/jobs",authmiddleware,async(req,res)=>{
    const userId = (req as unknown as AuthenticatedRequest).userId;
    if(!userId){
        res.json({
            message:"User not authenticated",
        })
        return
    }   
    try {
        const jobs = await prismaclient.jobs.findMany({
            include: {
                HR: {
                    select: {
                        firstname: true,
                        lastname: true,
                        email: true,
                    },
                },
            },
        })
        res.json({jobs})
    } catch (error) {
        res.json({
            message:"Error fetching jobs",
        })
    }
})
userroutes.post("/apply",(req,res)=>{
    res.json({message:"User applied for job"})
})
userroutes.get("/appliedjobs",authmiddleware,(req,res)=>{
    const userId = (req as unknown as AuthenticatedRequest).userId;
    if(!userId){
        res.json({
            message:"User not authenticated",
        })
        return
    }
    const appliedJobs = prismaclient.userJobs.findMany({
        where: {
            userId: userId,
        },
    })
    res.json({appliedJobs})
})
userroutes.get("/appliedjobs/:id",authmiddleware,async(req,res)=>{
    const userId = (req as unknown as AuthenticatedRequest).userId;
    const jobIdParam = req.params.id;
    
    if(!userId){
        res.json({
            message:"User not authenticated",
        })
        return
    }
    
    if(!jobIdParam){
        res.json({
            message:"Job ID is required",
        })
        return
    }
    
    const jobId = parseInt(jobIdParam);
    
    if(isNaN(jobId)){
        res.json({
            message:"Invalid job ID",
        })
        return
    }
    
    try {
        const appliedJob = await prismaclient.userJobs.findUnique({
            where: {
                userId_jobId: {
                    userId: userId,
                    jobId: jobId,
                },
            },
            include: {
                job: {
                    include: {
                        HR: {
                            select: {
                                firstname: true,
                                lastname: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        })
        
        if(!appliedJob){
            res.json({
                message:"Job application not found",
            })
            return
        }
        
        res.json({
            appliedJob: appliedJob,
        })
    } catch (error) {
        res.json({
            message:"Error fetching job application",
        })
    }
})
