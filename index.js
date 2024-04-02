import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import ConnectDB from './Db/index.js';
import userRouter from './Routes/userRoutes.js';
import { notfound, errorHandler } from './Middleware/error.js';
import teamRouter from './Routes/teamRoutes.js';
import challengeRouter from './Routes/challengeRoutes.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use('/api/users', userRouter);
app.use('/api/team', teamRouter);
app.use('/api/challenge', challengeRouter);

app.use(notfound);
app.use(errorHandler);

ConnectDB().then(()=>{
    app.listen(process.env.PORT, () => {
      console.log(`Example app listening on port ${process.env.PORT} `);
    })
}).catch((error)=>{
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
})
  