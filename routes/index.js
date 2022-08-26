const { Router } = require("express");
const router = Router();

router.use(require('./playgrounds.route'))
router.use(require('./images.route'))
router.use(require('./sports.route'))

module.exports = router;