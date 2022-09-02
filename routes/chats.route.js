const { Router } = require('express')
const router = Router()
const { chatsController } = require('../controllers/chats.controlles')


router.post("/chat", chatsController.createChat)
router.get("/chat/:userId", chatsController.userChats)
router.get("/chat/find/:firstId/:secondId", chatsController.findChat)


module.exports = router 