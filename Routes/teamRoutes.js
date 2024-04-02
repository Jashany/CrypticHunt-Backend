import express from "express";
import {
  createTeam,
  joinTeam,
  getTeam,
} from "../Controllers/teamController.js";

const teamRouter = express.Router();

teamRouter.post("/create", createTeam);
teamRouter.post("/join", joinTeam);
teamRouter.post("/getTeam", getTeam);

export default teamRouter;
