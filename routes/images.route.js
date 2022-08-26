const { Router } = require('express');
const { imageController } = require('../controllers/images.controller');

const router = Router();

router.post('/upload-img', imageController.upload)

module.exports = router;