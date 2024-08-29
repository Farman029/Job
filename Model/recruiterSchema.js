const mongoose = require('mongoose');
const plm=require("passport-local-mongoose");
const recruiterSchema = new mongoose.Schema({
 username: {
    type: String,
    required: true,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  company: {
    type: String,
    required: true
  },

  posts:[
    {
  type:mongoose.Schema.Types.ObjectId,
  ref:"jobPost"
  
  }
  ]

  
});

recruiterSchema.plugin(plm);

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports = Recruiter;
