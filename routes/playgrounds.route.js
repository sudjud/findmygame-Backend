const { Router } = require("express");
const router = Router();
const { playgroundController } = require('../controllers/playgrounds.controller');

router.post('/playground', playgroundController);

module.exports = router;