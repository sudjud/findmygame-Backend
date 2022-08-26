const Router = require('express');
const router = Router();
const { sportController } = require('../controllers/sports.controller')

router.post('/sport', sportController.postSport);

module.exports = router;