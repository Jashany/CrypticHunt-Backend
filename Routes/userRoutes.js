import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
} from "../Controllers/userController.js";
import verify from "../Middleware/verify.js";
import { getLeaderBoard } from "../Middleware/cache.js";

const userRouter = express.Router();
userRouter.post("/auth", authUser);
userRouter.post("/", registerUser);
userRouter.get("/leaderboard", getLeaderBoard);
// userRouter.post('/forgetpassword', forgetpassword )
// userRouter.post('/resetpassword/:id/:token', resetpassword )
userRouter.post("/logout", verify, logoutUser);

export default userRouter;
