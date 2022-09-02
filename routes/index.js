const { Router } = require("express");
const router = Router();

router.use(require("./playgrounds.route"));
router.use(require("./images.route"));
router.use(require("./sports.route"));
router.use(require("./users.route"));
router.use(require("./teams.route"));

module.exports = router;
