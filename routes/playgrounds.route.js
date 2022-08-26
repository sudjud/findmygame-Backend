const { Router } = require("express");
const router = Router();
const { playgroundController } = require('../controllers/playgrounds.controller');

router.post('/playground', playgroundController.postPlayground);

router.get('/playground', playgroundController.getPlaygrounds);

module.exports = router;