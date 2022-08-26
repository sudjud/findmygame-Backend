const mongoose = require('mongoose');

const Sport = mongoose.model('Sport', mongoose.Schema({
  name: { type: String, require: true }
}));

module.exports = Sport;