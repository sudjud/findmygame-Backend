const Router = require('express');
const router = Router();
const { sportController } = require('../controllers/sports.controller')

router.post('/sport', sportController.postSport);
router.get('/sport', sportController.getSports);

module.exports = router;