import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  link: {
    type: String,
  },
  solved: {
    type: Boolean,
    default: false,
  },
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
