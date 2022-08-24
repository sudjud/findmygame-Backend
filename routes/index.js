const { Router } = require("express");
const router = Router();

router.use(require('./playgrounds.route'))

module.exports = router;