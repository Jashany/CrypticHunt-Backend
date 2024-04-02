import asyncHandler from 'express-async-handler';
import Team from '../Models/Team.model.js';
import Question from '../Models/question.model.js';
import { nanoid } from 'nanoid';

const  getquestion = asyncHandler(async (req, res) => {
    try {
    const questions = await Question.find();
    res.json(questions);
    } catch (error) {
        res.status(400);
      throw new Error('Cant get questions');  
    }
});    

const getquestionById = asyncHandler(async (req, res) => {
    try {
    const { id } = req.params;
    const question = await Question.findById(id).populate('child');
        if(question){
            res.json(question);
        }
        else{
            res.status(404);
            throw new Error('Question not found');
        }
    }
    catch (error) {
        res.status(400);
      throw new Error('Cant get question');  
    }
});

const createQuestion = asyncHandler(async (req, res) => {
    try {
    const { question, answer, score , type } = req.body;
    const quesID = nanoid(10);
    const newQuestion = await Question.create({ quesID, question, answer, score, type });
    res.status(201).json(newQuestion);
    } catch (error) {
        res.status(400);
      throw new Error('Cant create question');  
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
            res.status(200).json({ message: 'Connected parent and child questions successfully' });
        } else {
            res.status(404);
            throw new Error('Parent or child question not found');
        }
    } catch (error) {
        res.status(400).json({ error: 'Error connecting questions: ' + error.message });
    }
});


const solveQuestionAndUnlockChildQuestions = async (team, questionId) => {
    try {
        const question = await Question.findById(questionId);
        if (!question) {
            throw new Error('Question not found');
        }

        // Mark the question as solved for the team
        team.solvedQuestions.push(questionId);
        await team.save();

        // Unlock child questions if any
        for (const childId of question.connectedquestion) {
            const childQuestion = await Question.findById(childId);
            if (childQuestion) {
                // Check if the child question is already solved by the team
                const isChildSolved = team.solvedQuestions.some(solvedQuestion => solvedQuestion.toString() === childId.toString());
                if (!isChildSolved) {
                    // If the child question is not solved by the team, mark it as unsolved (false)
                    childQuestion.solved = false;
                    await childQuestion.save();
                }
            }
        }
    } catch (error) {
        throw new Error('Error solving question and unlocking child questions: ' + error.message);
    }
};


// Controller function to check the answer and solve/unlock questions
const checkans = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const {teamId, answer } = req.body;
        console.log(id, answer, teamId);
        // Find the team
        const team = await Team.findOne({ teamId :teamId }).populate('solvedQuestions');
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        // Find the question
        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        if (team.solvedQuestions.some(solvedQuestion => solvedQuestion._id.toString() === id)) {
            return res.status(400).json({ error: 'Question has already been solved by the team' });
        }

        if (question.answer === answer) {
            // Update the team's score
            team.score += question.score;
            await team.save();

            // Solve the question and unlock its child questions
            await solveQuestionAndUnlockChildQuestions(team, question._id);

            // Send response
            res.status(200).json({ message: 'Correct answer! Score updated.', team });
        } else {
            res.status(400).json({ error: 'Incorrect answer. Please try again.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export { getquestion, getquestionById, createQuestion ,connectParent ,checkans};