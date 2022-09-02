const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport'
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  maxMembers: Number,
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  time: {
    type: mongoose.Schema.Types.Date,
    default: new Date()
  },
  ready: {
    type: Boolean,
    default: false
  }
})

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;