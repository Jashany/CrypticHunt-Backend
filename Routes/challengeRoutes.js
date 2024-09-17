import express from "express";
import {
  getquestionById,
  checkans,
  createQuestion,
} from "../Controllers/challengeController.js";

const challengeRouter = express.Router();
challengeRouter.get("/getques/:id", getquestionById);

// make this protected!
challengeRouter.post("/addques", createQuestion);
challengeRouter.post("/checkans/:id", checkans);

export default challengeRouter;
