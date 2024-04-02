import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  quesID: {
    type: String,
    required: true,
  },
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
  type: {
    type: String,
    required: true,
  },
  solved: {
    type: Boolean,
    default: false,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
  child: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
