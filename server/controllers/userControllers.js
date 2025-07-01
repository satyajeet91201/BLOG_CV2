import User from "../models/userModel.js"

export const getAllUsers = async (req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json({
            status:"Success",
            users,
        })
    }catch(err){
        res.status(404).json({
            status:"Failed",
            message: err.message
        })
    }
}

export const getUserData = async(req,res)=>{
    try{
        const userId = req.userId; // Assuming req.userId is correctly populated by your auth middleware
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({
                status: "Fail",
                message: "User not found"
            });
        }

        return res.status(200).json({
            status:"Success",
            userData:{
                _id: user._id, // <--- ADD THIS LINE! This is the missing piece!
                Name: user.name,
                IsVerified : user.isAccountVerified,
                Email: user.email,
                role: user.role
            }
        });

    }catch(err){
        return res.status(500).json({ // Changed to 500 for server errors
            status: "Fail",
            message: err.message
        });
    }
}
