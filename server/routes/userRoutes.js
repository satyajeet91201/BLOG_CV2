import express from "express";
import  {getAllUsers, getUserData}  from "../controllers/userControllers.js";
import { userAuth } from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.route('/user').get(getAllUsers);
userRouter.route('/user/data').get(userAuth, getUserData);


export default userRouter;