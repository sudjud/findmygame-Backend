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
  }
}