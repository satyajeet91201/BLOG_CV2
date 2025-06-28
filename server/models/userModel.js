import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    },
    verifyOTp:{
        type:String,
        default:"",
    },
    verifyOTpExpireAt:{
        type:Number,
        default:0,
    },
    isAccountVerified:{
        type:Boolean,
        default:false,
    },
    resetOtp:{
        type:String,
        default:""
    },
    verifyOTpExpireAt:{
        type:Number,
        default:0,
    }

})

const User = mongoose.model('user',userSchema);

export default User;