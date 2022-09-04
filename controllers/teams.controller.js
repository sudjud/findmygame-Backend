const Team = require('../models/Team.model')
const mongoose = require('mongoose');
const {
  botApi
} = require('../service/telegram-service');


module.exports.teamController = {
  createTeam: async (req, res) => {
    try {
      user = req.user;
      const newTeam = await Team.create({
        admin: user.id,
        maxMembers: req.body.maxMembers,
        sport: req.body.sport,
        members: [
          user.id
        ]
      });
      res.json(await Team.find({}).populate('admin sport').populate('members'));
    } catch (e) {
      res.json(e);
    }
  },

  getTeams: async (req, res) => {
    try {
      const teams = await Team.find({}).populate('admin sport').populate('members')
      res.json(teams)
    } catch (e) {
      res.json(e);
    }
  },

  joinToTeam: async (req, res) => {
    try {
      const user = req.user
      const team = await Team.findById(req.params.id)
      const isAdmin = team.admin === user.id;
      const isMember = team.members.includes(user.id);

      if (isAdmin || isMember) {
        return res.json({
          message: 'Вы уже в команде'
        })
      }

      if (team.members.length === team.maxMembers) {
        return res.json({
          message: 'Команда уже собрана'
        })
      }

      if (team.members.length - 1 === team.maxMembers) {
        team.ready = true;
        team.save();
      }
      let messageForNew = `Ты вступил в команду ${user.name}!
      В команде ${team.members.length + 1} человек.
      Ждем еще ${team.maxMembers - team.members.length - 1}
      Даты создания команды: ${team.time}.`

      if (user.telegramId) {
        botApi.joinedNotify(messageForNew, user.telegramId);
      }

      for (let user of team.members) {
        const User = await mongoose.models.User
        let chat = await User.find({
          _id: user
        })
        const tgId = chat[0].telegramId
        if (tgId) {
          let message = `В вашем полку прибыло! ${team.members.length + 1}/${team.maxMembers}`
          botApi.joinedNotify(message, tgId);
        }
      }
      const newTeam = await Team.findByIdAndUpdate(req.params.id, {
        $push: {
          members: user.id
        }
      }, {
        new: true
      }).populate('admin sport').populate('members');
      
      res.json(newTeam);
    } catch (e) {
      res.json(e)
    }
  }
}