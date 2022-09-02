const Team = require('../models/Team.model')

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
        return res.json({message: 'Вы уже в команде'})
      }
      if (team.members.length === team.maxMembers) {
        team.ready = true;
        team.save();
        return res.json({message: 'Команда уже собрана'})
      }
      const newTeam = await Team.findByIdAndUpdate(req.params.id, {
        $push: {
          members: user.id
        }
      }, {new: true}).populate('admin sport').populate('members');
      
      res.json(newTeam);
    } catch (e) {
      res.json(e)
    }
  }
}