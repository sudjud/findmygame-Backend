const { Router } = require("express");
const router = Router();
const { teamController } = require("../controllers/teams.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/teams", authMiddleware, teamController.createTeam);

router.get("/teams", teamController.getTeams);

router.patch("/join-to-team/:id", authMiddleware, teamController.joinToTeam);

router.patch("/exit-team/:id", authMiddleware, teamController.logoutTeam);

module.exports = router;
