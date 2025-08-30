import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user_model.js";
import jwt from "jsonwebtoken"
export const registerUser= async(req,res)=>{
    try{
        const {number,password,confirmpassword}= req.body;
        if(await User.findOne({number}))return res.status(404).json({message:"user already exists"});
        if (password===confirmpassword){
        const salt =await bcrypt.genSalt(10);
        const password_hash= await bcrypt.hash(password,salt);
        const newUser=new User({number,password_hash})
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
        }
        
         
    }catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const loginUser = async (req, res) => {
  try {
    const { number, password } = req.body;

    // check user
    const user = await User.findOne({ number });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // generate JWT
    const token = jwt.sign(
      { id: user._id, number: user.number },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
