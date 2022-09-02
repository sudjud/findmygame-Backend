const Playground = require("../models/Playground.model");

module.exports.playgroundController = {
  postPlayground: async (req, res) => {
    try {
      const playground = await Playground.create({
        ...req.body,
      });
      res.json(playground);
    } catch (e) {
      res.json(e);
    }
  },

  getPlaygrounds: async (req, res) => {
    try {
      res.json(
        await Playground.find({})
          .populate("photos sport")
          .populate({
            path: "reviews",
            populate: {
              path: "user",
              model: "User",
            },
          })
          .populate({
            path: "booking",
            populate: {
              path: "user",
              model: "User",
            },
          })
      );
    } catch (e) {
      res.json(e);
    }
  },

  // Добавление отзыва к месту
  addReview: async (req, res) => {
    try {
      const { review, star } = req.body;
      const data = await Playground.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            reviews: {
              stars: star,
              text: review,
              user: req.user.id,
            },
          },
        },
        { new: true }
      )
        .populate("reviews")
        .populate({
          path: "reviews",
          populate: {
            path: "user",
            model: "User",
          },
        });
      res.json(data);
    } catch (error) {
      res.json(error);
    }
  },

  rentPlayground: async (req, res) => {
    try {
      const playground = await Playground.findById(req.params.id);
      let from, to;
      const newPlayground = await Playground.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            booking: {
              from: req.body.from,
              to: req.body.to,
              user: req.user.id,
            },
          },
        },
        { new: true }
      ).populate("booking");
      res.json(newPlayground);
    } catch (e) {
      res.json(e);
    }
  },
};
