import asyncHandler from "express-async-handler";
import Question from "../Models/question.model.js";
import client from "../Db/redis-client.js";
import Team from "../Models/Team.model.js";

const getquestionById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const quesID = await Question.findById(id);
    if (quesID) {
      await client.set(`question:${id}`, JSON.stringify(quesID));
      const { _id, question, score, solved, link } = quesID;
      const responseData = { _id, score, question, link, solved };
      res.status(200).json(responseData);
    } else {
      res.status(404).json({
        status: "failure",
        reason: "Question not found!",
      });
      throw new Error("Question not found");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Cant get question");
  }
});

const createQuestion = asyncHandler(async (req, res) => {
  try {
    const { question, answer, score, link } = req.body;
    const newQuestion = await Question.create({
      question,
      answer,
      score,
      link,
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400);
    throw new Error("Cant create question");
  }
});

const checkans = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {teamID,answer} = req.body;
    const team = await Team.findById(teamID);
    const ques = await Question.findById(id);
    if(team.solvedQuestions.includes(ques._id)){
      res.status(200).json({
        status: "failure",
        message: "Question already solved",
      });
      return;
    }
    if (ques) {
      if (ques.answer === answer) {
        team.solvedQuestions.push(ques._id);
        team.score += ques.score;
        await team.save();
        res.status(200).json({
          status: "success",
          message: "Correct answer",
        });
      } else {
        res.status(200).json({
          status: "failure",
          message: "Incorrect answer",
        });
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error("Cant check answer",error.message);
  }
});

    
    


// const connectParent = asyncHandler(async (req, res) => {
//   try {
//     const { parentID, childID } = req.body;
//     const parent = await Question.findOne({ quesID: parentID });
//     const child = await Question.findOne({ quesID: childID });
//     if (parent && child) {
//       child.parent = parent._id; // Assign parent's _id to child's parent field
//       parent.child.push(child._id); // Push child's _id to parent's child array
//       await child.save(); // Save the child question with updated parent
//       await parent.save(); // Save the parent question with updated child
//       res
//         .status(200)
//         .json({ message: "Connected parent and child questions successfully" });
//     } else {
//       res.status(404);
//       throw new Error("Parent or child question not found");
//     }
//   } catch (error) {
//     res
//       .status(400)
//       .json({ error: "Error connecting questions: " + error.message });
//   }
// });

export { getquestionById, createQuestion ,checkans };
