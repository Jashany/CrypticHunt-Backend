import express from "express";
import {
  getquestionById,
  checkans,
  createQuestion,
} from "../Controllers/challengeController.js";

import { getQuesById } from "../Middleware/cache.js";

const challengeRouter = express.Router();
challengeRouter.get("/getques/:id", getQuesById, getquestionById);

// make this protected!
challengeRouter.post("/addques", createQuestion);
challengeRouter.post("/checkans/:id",checkans);

export default challengeRouter;
