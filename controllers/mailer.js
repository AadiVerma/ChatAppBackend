import nodemailer from 'nodemailer';
import mailgen from 'mailgen';
import dotenv from 'dotenv'
dotenv.config()

let nodeConfig={
    service: "gmail",
    auth: {
        user: process.env.email,
        pass: process.env.password,
    },
}
let transporter=nodemailer.createTransport(nodeConfig);
let mailgenerator=new mailgen({
    theme: 'default',
    product: {
        name: 'Connect Hub',
        link: 'https://github.com/AadiVerma'
    }
})
export const Contact=async(req,res)=>{
    const {username,userEmail,text,subject}=req.body;
    let email={
        body:{
            name:"Connect Hub",
            intro:text || 'Welcome to the chat app We\'re excited to have you on board',
            outro: `Yours's Sincerely,<br>${username}`,
            signature: false,
            greeting: false
        }
    }
    let emailBody=mailgenerator.generate(email);
    let message ={
        from:userEmail,
        to:process.env.Email,
        subject:subject || 'SignUp Successfully',
        html:emailBody
    }
    transporter.sendMail(message)
    .then(()=>{
        return res.status(200).send({msg:"You should recieve this email from us"});
    })
    .catch(error=>{
         res.status(500).send({error});
    }) 
}
export const registerMail=async (req,res)=>{
    const {username,userEmail,text,subject}=req.body;
    console.log(req.body);
    let email={
        body:{
            name:username,
            intro:text || 'Welcome to the chat app We\'re excited to have you on board' ,
            outro:'Need help or have any Question Just reply to this email , we\'d love to help you figure out'
        }
    }
    let emailBody=mailgenerator.generate(email);
    
    let message ={
        from:process.env.Email,
        to:userEmail,
        subject:subject || 'SignUp Successfully',
        html:emailBody
    }
    transporter.sendMail(message)
    .then(()=>{
        return res.status(200).send({msg:"You should recieve this email from us"});
    })
    .catch(error=>{
         res.status(500).send({error});
    })  
}