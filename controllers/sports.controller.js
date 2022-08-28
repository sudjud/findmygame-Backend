const Sport = require('../models/Sport.model');

module.exports.sportController = {
  postSport: async (req, res) => {
    try {
      const newSport = await Sport.create({
        name: req.body.name
      });
      res.json(newSport);
    } catch (e) {
      res.json(e);
    }
  },
  getSports: async (req, res) => {
    try {
      const sports = await Sport.find({})
      res.json(sports);
    } catch (e) {
      res.json(e);
    }
  }
}