const Playground = require('../models/Playground.model')

module.exports.playgroundController = {
  postPlayground: async (req, res) => {
    try {
      const playground = await Playground.create({
        ...req.body
      });
      res.json(playground);
    } catch (e) {
      res.json(e);
    }
  },
  
  getPlaygrounds: async (req, res) => {
    try {
      res.json(await Playground.find({}).populate('photos sport reviews'))
    } catch (e) {
      res.json(e);
    }
  }
}