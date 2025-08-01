import express,{Router} from "express"
import { userroutes } from "./user"
import { hrroutes } from "./hr"
export const allroutes:Router=express.Router()
allroutes.use("/user",userroutes)
allroutes.use("/hr",hrroutes)