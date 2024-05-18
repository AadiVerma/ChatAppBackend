import MessageModel from "../MessageModel.js";
export const  addMessage = async(req,res)=>{
        const {chatId,senderId,text}=req.body;
        const message=new MessageModel({
            chatId,
            senderId,
            text
        })
        try{
            const result=await message.save();
            return res.status(200).json(result);
        }
        catch(err){
            return res.status(400).json({error:err.message});
        }
}
export const getMessages=async(req,res)=>{
    const {chatId}=req.params;
    // console.log(chatId);
    try{
        const result=await MessageModel.find({chatId});
        // console.log(result);
        res.status(200).json(result);
    }
    catch(error){
        res.status(400).json({error});
    }
}
