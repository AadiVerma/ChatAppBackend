import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config() 
export default async function (req,res,next){
    try {
        const token=req.headers.authorization.split(" ")[1];
        const decodedtoken= await jwt.verify(token,process.env.JWT_SECRET);
        req.user=decodedtoken;
        next();
    } catch (error) {
        res.status(401).json({error:"Authentication Failed"});
    }
}
// middleware for local variable so that we can access otp 
export function localVariable(req,res,next){
    req.app.locals={
        OTP:null,
        resetSession:false,
    }
    next();
}