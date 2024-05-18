import userModel from '../database/conn.js';
// import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import otpgenerator from 'otp-generator';
import dotenv from 'dotenv';
dotenv.config();
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;
        let exist = await userModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "User not found" });
        next();
    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
}
export async function register(req, res) {
    try {
        const { username, email, password, profile } = req.body;
        // check the existing user
        const existinguser = await userModel.findOne({ username });
        if (existinguser) {
            return res.status(400).json({ error: "Please use a unique username" });
        }

        // check for existing email
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Please use a unique email" });
        }
        // const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            username,
            firstName:'',
            lastName:'',
            MobileNo:'', 
            Address:'',
            email,
            password: password,
            profile: profile || ''
        });
        await newUser.save();
        return res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
export async function login(req, res) {
    const { username, password } = req.body; 
    try {
        await userModel.findOne({ username }).then(user => {
            
            // bcrypt.compare(password, user.password).then((passwordcheck) => {
                if (password!=user.password) {                
                    return res.status(400).json({ error: "Incorrect password" })
                }
                try{
                const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "24h" });
                
                return res.status(200).send({
                    msg: "Login SuccessFully...",
                    username: user.username, token
                });
            }catch{
                return res.status(400).json({ error: "Incorrect password" });
            }
        }).catch(() => {
            res.status(500).json({ error: "User Not Found" });
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getUserForChat(req,res){
    const {userId}=req.params;
    try{
        const result=await userModel.find({_id:userId});
        res.status(200).json(result);
    }
    catch(error){
        res.status(400).json({error});
    }
}
// export async function getAlluser(req,res){
//     try{
//         const result=await userModel.find();
//         res.status(200).json(result);
//     }
//     catch(error){
//         res.status(400).json({error});
//     }
// }
export async function getUser(req, res) {   
    const {username} = req.params;
    try {
      if (!username) { 
        return res.status(400).send({ error: "Invalid username provided" });
      }
      const data = await userModel.findOne({ username });  
      if (!data) {
        return res.status(404).send({ error: "User not found" });
      }  
    //   console.log(data);
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
    }
  }
  
export async function updateUser(req, res) { 
    try {
        
        const { userId } = req.user; // we got user id in req during autentication request .. go and check it on auth.js
        if (userId) {
            const body = req.body;
            await userModel.updateOne({ _id: userId }, body)  
          
            return res.status(200).send({ message: "User updated successfully" });
        }
        else {
            return res.status(401).send({ error: "User Not Found" });

        }
    } catch (error) {
        return res.status(401).send({ error });
    }
}
export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpgenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    // console.log(req.app.locals.OTP);
    res.status(201).send({ code: req.app.locals.OTP });
}
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(201).json({ message: "OTP Verified" });
    }
    return res.status(400).json({ err: "Invalid OTP" })
}
export async function createResetSession(req, res) {
    if (req.app.locals.session) {
        req.app.locals.resetSession = false; // alow access to this route only once
        return res.status(201).send({ msg: "access granted" });
    }
    return res.status(440).send({ error: "Session Expired" });
}
export async function ResetPassword(req, res) {
    try {
        const {username,password} = req.body;
       
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
       
        // const hashedPassword = await bcrypt.hash(password, 10);
        const isUpdated = await userModel.updateOne({ username }, { password: password });
        if (!isUpdated) {
            return res.status(401).send({ msg: "Not updated" });
        }
        return res.status(201).send({ msg: "Updated successfully" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}
