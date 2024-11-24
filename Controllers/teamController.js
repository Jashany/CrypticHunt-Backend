import { nanoid } from "nanoid";
import asyncHandler from "express-async-handler"; // Assuming you're using this for error handling
import Team from "../Models/Team.model.js";

const createTeam = asyncHandler(async (req, res) => {
  const { teamName, userId } = req.body;

  const existingMembership = await Team.findOne({
    "members.user": userId,
  }).populate("members.user", "email");
  if (existingMembership) {
    return res.status(400).json({ message: "You are already part of a team" });
  }

  const existingTeam = await Team.findOne({ teamName: teamName });
  if (existingTeam) {
    return res
      .status(400)
      .json({ message: "A team with this name already exists" });
  }

  const teamId = nanoid(5); // Generate a unique teamId

  let team = await Team.create({
    teamName: teamName,
    teamId: teamId,
    members: [{ user: userId, role: "admin" }],
    score: 0,
  });

  team = await team.populate("members.user", "email");
  team = await team.populate("members.user", "name");

  const response = {
    message: "Team created successfully",
    teamId: team.teamId,
    teamName: team.teamName,
    score : team.score,
    members: team.members.map((member) => ({
      email: member.user.email,
      name: member.user.name,
      role: member.role,
    })),
  };

  return res.status(201).json(response);
});

const joinTeam = asyncHandler(async (req, res) => {
  const { teamId, userId } = req.body;

  const existingMembership = await Team.findOne({
    "members.user": userId,
  }).populate("members.user", "email");
  if (existingMembership) {
    return res.status(400).json({
      message: "You are already part of a team and cannot join another",
    });
  }

  let team = await Team.findOne({ teamId });
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }
  if (team.members.length >= 3) {
    return res
      .status(400)
      .json({ message: "This team already has the maximum number of members" });
  }

  team.members.push({ user: userId, role: "member" });
  await team.save();

  team = await team.populate("members.user", "email");
  team = await team.populate("members.user", "name");
  const response = {
    message: "Joined the team successfully",
    teamId: team.teamId,
    teamName: team.teamName,
    score : team.score,
    solvedQuestions: team.solvedQuestions,
    members: team.members.map((member) => ({
      email: member.user.email,
      name: member.user.name,
      role: member.role,
    })),
  };

  return res.status(200).json(response);
});
const getTeam = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    // Assuming the user ID is available from authentication middleware
    // Find the team where the user is a member
    const team = await Team.findOne({ "members.user": userId }).populate(
      "members.user",
      "email name",
    );

    if (!team) {
      return res.status(404).json({ message: "User is not part of any team" });
    }
    const response = {
      teamId: team.teamId,
      teamName: team.teamName,
      members: team.members.map((member) => ({
        email: member.user.email, // Assuming email is a field in the User model
        name: member.user.name,
        role: member.role,
      })),
      solvedQuestions: team.solvedQuestions,
      score: team.score, // Assuming you also want to include the team's score
    };
    
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error getting team details:", error);
    return res.status(500).json({ message: "Server error" });
  }
});



export { createTeam, joinTeam, getTeam };
