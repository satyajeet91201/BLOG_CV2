import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import fs from "fs";
import path from "path"

export const register = async (req, res) => {
  console.log("Reached");
  const { name, email, password,role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: "Fail",
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    
// ✅ Simulated Email (Write to Local File)
const welcomeMessage = `
New User Registered:
---------------------
Name: ${name}
Email: ${email}
Message: Welcome ${name} to Great Stack Website! Your account has been created.
---EMAIL_SEPARATOR---
`;

    const filePath = path.join(process.cwd(), "welcome_logs.txt");
    fs.appendFileSync(filePath, welcomeMessage, "utf-8");

    console.log(newUser);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

 
    return res.status(200).json({
      status: "Success",
      message: "New user created and email sent",
      newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        status: "fail",
        message: "User not found. Please register first.",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({
        status: "fail",
        message: "Incorrect password",
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: "Success",
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      status: true,
      message: "Successfully logged out",
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

export const sendVerifyOtp = async (req, res)=>{
    try{
        const userId = req.userId;
        const user = await User.findById(userId);
        if(user.isAccountVerified){
            return res.status(400).json({
                status: "Fail",
                message: "Account already verified",
              });
        }
        const otp = String(Math.floor(100000 + Math.random()*900000))
        user.verifyOTp = otp;
        user.verifyOTpExpireAt = Date.now() + 24*60*60*1000;
        await user.save();

        //Send the OTP :

        const otpMessage = `
New OTP Sent:
---------------------
Name: ${user.name}
Email: ${user.email}
OTP: ${otp}
Message: Your account verification OTP is: ${otp}
Time: ${new Date().toLocaleString()}
---OTP_SEPARATOR---
`;

    const filePath = path.join(process.cwd(), "otp_logs.txt");
    fs.appendFileSync(filePath, otpMessage, "utf-8");

        res.json({
            success: true,
            message: 'Verification OTP Sent on Email'
        });

    }catch (err) {
        return res.status(400).json({
          status: "Fail",
          message: err.message,
        });
      }
}

export const verifyEmail = async (req,res)=>{

    const userId = req.userId;
    console.log("Verify email controler" ,userId);
    const {otp} = req.body;
    console.log(otp);
    if(!userId || !otp){
        return res.status(404).json({
            status:"Fail",
            message:"Missing Details"
        });
    }try{
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
              status: "Fail",
              message: "User not found",
            });
          }

          if(user.verifyOTpExpireAt < Date.now()){
            return res.status(404).json({
                status: "Fail",
                message: "OTP has expired",
              });

          }
        if(user.verifyOTp === otp)
            {
                user.isAccountVerified = true;
                user.verifyOTp = null;
                user.verifyOTpExpireAt = null;
                await user.save();

                return res.status(200).json({
                    status:true,
                    message:"Your account is verified"
                })
            }
            else{
                res.status(404).json({
                    status:"Fail",
                    message:"Your account is not verified. Enter correct OTP."
            })
        }
    }catch(err)
    {
        return res.status(400).json({
            status: "Fail",
            message: err.message,
          });
    }
}

export const isAuthenticated = (req,res)=>{
    try{
        
        return res.status(200).json({
            success: true,
            message: "You are authenticated and logged in"
        })
    }catch(err)
    {
        return res.status(400).json({
            success: false,
            message: err.message,
          });
    }
}

export const sendResetOtp = async(req,res)=>{
    const userId = req.userId;
    try{

        const user = await User.findById(userId);
        if(!user)
        {
          res.status(404).json({
            status: false,
            message: "User Not Found"
          })
        }

            const otp = String(Math.floor(100000 + Math.random() * 900000));
            user.verifyOTp = otp;
            user.verifyOTpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
            await user.save();
            const otpMessage = `
            New OTP Sent:
            ---------------------
            Name: ${user.name}
            Email: ${user.email}
            OTP: ${otp}
            Message: Your password reset verification OTP is: ${otp}
            Time: ${new Date().toLocaleString()}
            ---OTP_SEPARATOR---
            `;
            
                const filePath = path.join(process.cwd(), "otp_logs.txt");
                fs.appendFileSync(filePath, otpMessage, "utf-8");

                res.status(200).json({
                    status:true,
                    message : "OTP sent to registered email"
                })
    }catch(err)
    {
        return res.status(404).json({
            status:false,
            message:err.message
        })
    }
}

export const resetPassword = async (req,res)=>{

    const {email, otp, newPassword} = req.body;
    
    if(!email || !otp || !newPassword){
        return res.status(404).json({
            status: false,
            message: "Mention all the details properly"
        })
    }
        try{
       const user = await User.findOne({email});
       if(!user)
        {
            return res.status(404).json({
                status:"Fail",
                message:"User does not exist with mentioned email id"
            })
        }
        if(otp === user.verifyOTp && Date.now() < user.verifyOTpExpireAt)
            {
                const hashedPassword = await bcrypt.hash(newPassword , 12);
                user.password = hashedPassword;
                user.verifyOTp = null;
                user.verifyOTpExpireAt = null;

                await user.save();

                return res.status(200).json({
                    status:true,
                    message:"Your password is updated"
                })
            }
            else{
              return res.status(200).json({
                    status:false,
                    message:"Pls enter correct otp. Murkha Manus !"
                })
            }
    }catch(err){
        return res.status(400).json({
            success:false,
            message: err.message
        })
    }
    }
 
 //EmailJS REST API integration 
 