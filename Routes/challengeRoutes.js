import express from 'express';
import { getquestion, getquestionById, createQuestion,connectParent,checkans } from '../Controllers/challengeController.js';

const challengeRouter = express.Router();

challengeRouter.get('/getques', getquestion);
challengeRouter.get('/getques/:id', getquestionById);
challengeRouter.post('/addques', createQuestion);
challengeRouter.post('/connect', connectParent);
challengeRouter.post('/ques/:id', checkans);

export default challengeRouter;