import asyncHandler from "express-async-handler";
import Team from "../Models/Team.model.js";
import Question from "../Models/question.model.js";
import { nanoid } from "nanoid";

const getquestion = asyncHandler(async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(400);
    throw new Error("Cant get questions");
  }
});

const getquestionById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).populate("child");
    if (question) {
      res.json(question);
    } else {
      res.status(404);
      throw new Error("Question not found");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Cant get question");
  }
});

const createQuestion = asyncHandler(async (req, res) => {
  try {
    const { question, answer, score, type } = req.body;
    const quesID = nanoid(10);
    const newQuestion = await Question.create({
      quesID,
      question,
      answer,
      score,
      type,
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400);
    throw new Error("Cant create question");
  }
});

const connectParent = asyncHandler(async (req, res) => {
  try {
    const { parentID, childID } = req.body;
    const parent = await Question.findOne({ quesID: parentID });
    const child = await Question.findOne({ quesID: childID });
    if (parent && child) {
      child.parent = parent._id; // Assign parent's _id to child's parent field
      parent.child.push(child._id); // Push child's _id to parent's child array
      await child.save(); // Save the child question with updated parent
      await parent.save(); // Save the parent question with updated child
      res
        .status(200)
        .json({ message: "Connected parent and child questions successfully" });
    } else {
      res.status(404);
      throw new Error("Parent or child question not found");
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error connecting questions: " + error.message });
  }
});

export { getquestion, getquestionById, createQuestion, connectParent };
