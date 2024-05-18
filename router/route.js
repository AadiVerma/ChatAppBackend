import {Router} from "express";
const router=Router();
import * as controller from '../controllers/appControllers.js';
import Auth , {localVariable}from "../middleware/auth.js";
import { registerMail ,Contact} from "../controllers/mailer.js";

// post
router.route('/register').post(controller.register);  
router.route('/registerMail').post(registerMail); //send the email
router.route('/contact').post(Contact);
router.route('/authenticate').post(controller.verifyUser,(req,res)=>res.end());
router.route('/login').post(controller.verifyUser,controller.login); 

// get
router.route('/user/:username').get(controller.getUser);   
// router.route('/user').get(controller.getAlluser);
router.route('/user/userId/:userId').get(controller.getUserForChat);
router.route('/generateOTP').get(controller.verifyUser,localVariable,controller.generateOTP); 
router.route('/verifyOTP').get(controller.verifyUser,controller.verifyOTP); 
router.route('/createResetSession').get(controller.createResetSession);


// put
router.route('/updateuser').put(Auth,controller.updateUser); 
router.route('/resetPassword').put(controller.verifyUser,controller.ResetPassword); 
export default router;