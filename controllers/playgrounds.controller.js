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
      res.json(await Playground.find({}).populate('photos sport reviews').populate({
        path: 'booking',
        populate: {
          path: 'user',
          model: 'User'
        }
      }))
    } catch (e) {
      res.json(e);
    }
  },

  rentPlayground: async (req, res) => {
    try {
      const playground = await Playground.findById(req.params.id);
      let from, to;
      const newPlayground = await Playground.findByIdAndUpdate(req.params.id, {
        $push: {
          booking: {
            from: req.body.from,
            to: req.body.to,
            user: req.user.id
          }
        }
      }, {new: true}).populate('booking')
      res.json(newPlayground);
    } catch (e) {
      res.json(e);
    }
  }
}