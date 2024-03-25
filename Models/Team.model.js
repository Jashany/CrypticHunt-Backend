import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'member'] 
  }
}, { _id: false }); 

const TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    unique: true
  },
  teamId : {
    type: String,
    required: true,
    unique: true
  },
  members: [teamMemberSchema],
  score: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Team = mongoose.model('Team', TeamSchema);
export default Team;
