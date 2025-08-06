import { JWT_SECRET } from "./config";
import multer from "multer"
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
interface AuthenticatedRequest extends Request {
  userId?: string;
}
export function authmiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (typeof token === "string" && token.startsWith("Bearer ")) {
    token = token.slice(7); // Remove "Bearer "
  }
  console.log(JWT_SECRET)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    console.log("Decoded token:", decoded);
    if (decoded ) {
      req.userId = decoded.id;
      console.log("Decoded userId:", req.userId);
      next();
    } else {
      res.status(403).json({ message: "User unauthorized 1" });
    }
  } catch (error) {
    res.status(403).json({ message: "User unauthorized" });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {        
    cb(null, file.originalname);
  }
});
export const upload = multer({ storage: storage });