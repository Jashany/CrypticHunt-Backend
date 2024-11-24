import asyncHandler from "express-async-handler";
import Question from "../Models/question.model.js";
import Team from "../Models/Team.model.js";

const getquestionById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const quesID = await Question.findById(id);
    if (quesID) {
      const { _id, question, score, solved, link } = quesID;
      const responseData = { _id, score, question, link, solved };
      return res.status(200).json(responseData);
    } else {
      return res.status(404).json({
        status: "failure",
        reason: "Question not found!",
      });
      throw new Error("Question not found");
    }
  } catch (error) {
    return res.status(400);
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
    return res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400);
    throw new Error("Cant create question");
  }
});


const checkans = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { teamID, answer } = req.body;

    // Find the team using the teamID
    const team = await Team.findOne({ teamId: teamID });
    const team_id = team._id;

    // Fetch the question directly from the database
    let ques = await Question.findById(id);

    if (!ques) {
      return res.status(404).json({
        status: "failure",
        message: "Question not found",
      });
    }

    // Check if the question is already solved by the team
    if (team.solvedQuestions.includes(ques._id)) {
      return res.status(409).json({
        status: "failure",
        message: "Question already solved",
      });
    }

    // Validate the answer
    if (ques.answer === answer) {
      const updatedTeam = await Team.findByIdAndUpdate(
        team_id,
        {
          $push: { solvedQuestions: ques._id },
          $inc: { score: ques.score },
          $set: { lastLevelCrackedAt: Date.now() },
        },
        { new: true }
      );

      if (!updatedTeam) {
        return res.status(404).json({
          status: "failure",
          message: "Team not found",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Correct answer",
      });
    } else {
      return res.status(200).json({
        status: "failure",
        message: "Incorrect answer",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "failure",
      message: "Can't check answer",
    });
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

export { getquestionById, createQuestion, checkans };
