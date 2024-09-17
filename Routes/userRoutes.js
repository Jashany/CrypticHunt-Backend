import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
 testRoute
} from "../Controllers/userController.js";
import verify from "../Middleware/verify.js";

const userRouter = express.Router();
userRouter.post("/auth", authUser);
userRouter.post("/", registerUser);
// userRouter.post('/forgetpassword', forgetpassword )
// userRouter.post('/resetpassword/:id/:token', resetpassword )
userRouter.post("/logout", verify, logoutUser);
userRouter.get("/test", testRoute);
export default userRouter;
