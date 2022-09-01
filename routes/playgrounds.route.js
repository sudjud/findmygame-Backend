const { Router } = require("express");
const router = Router();
const { playgroundController } = require('../controllers/playgrounds.controller');
const authMiddleware = require("../middlewares/authMiddleware");

router.post('/playground', playgroundController.postPlayground);

router.get('/playground', playgroundController.getPlaygrounds);

router.patch('/rent/playground/:id', authMiddleware, playgroundController.rentPlayground)

module.exports = router;