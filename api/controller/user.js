import bcryptjs from "bcryptjs";
import User from "../models/user.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.js";
export const test=(req,res)=>{
    res.send("hyy from router hy ayush/")
};
export const updateUser= async (req,res, next)=>{
    if(req.user.id!==req.params.id )
        return next(errorHandler(403,"You can update only your account"));
  
try{
    if(req.body.password){
      
       req.body.password=  bcryptjs.hashSync(req.body.password,10);
    }
const updatedUser= await User.findByIdAndUpdate(req.params.id,{
    $set:{
      username:req.body.username,
      email:req.body.email,
        password:req.body.password,
        avatar:req.body.avatar
        
    }
    
}, {new:true});
    const {password,...rest}= updatedUser._doc;
    res.status(200).json(rest);

}catch(err){
    next(err);
}

}
export const deleteUser= async (req,res, next)=>{
 if(req.user.id!==req.params.id )
        return next(errorHandler(403,"You can delete only your account"));

 try{
    await User.findOneAndDelete(req.params.id);
    res.status(200).json("user has been deleted successfully");



 }catch(error){
    next(error);
 }
}

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};


export const getUser = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
