import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";
await mongoose.connect(process.env.MONGOOSE_URL).then(() => {
    console.log("Connected to MongoDB");
  });
const usermodel=mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please Provide Unique Username"],
        unique:true
    },
    firstName:{ 
        type:String,
        unique:false
    },
    lastName:{
        type:String,
        unique:false
    },
    MobileNo:{
        type:String, 
    },
    Address:{
        type:String,
        unique:false
    },
    password:{
        type:String,
        required:[true,"Please Provide Unique Password"],
    },
    email:{
        type:String,
        required:[true,"Please Provide Unique Email"],
        unique:true
    },
    profile:{type:String}

});
const userModel=mongoose.model('User',usermodel);
export default userModel;

