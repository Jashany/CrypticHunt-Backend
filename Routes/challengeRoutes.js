import express from "express";
import {
  checkans,
  createQuestion,
} from "../Controllers/challengeController.js";


const challengeRouter = express.Router();

// make this protected!
challengeRouter.post("/addques", createQuestion);
challengeRouter.post("/checkans/:id", checkans);

export default challengeRouter;
