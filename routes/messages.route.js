const { Router } = require('express')
const router = Router()
const { messagesController } = require('../controllers/messages.controller')


router.post('/message', messagesController.addMessage)
router.get('/message/:chatId', messagesController.getMessage)


module.exports = router