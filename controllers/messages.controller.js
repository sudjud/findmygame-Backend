const Message = require("../models/message.model");

module.exports.messagesController = {
    addMessage : async (req, res) => {
        const { chatId, senderId, text } = req.body
        const message = new Message({
            chatId,
            senderId,
            text
        })
        try {
            const result = await message.save()
            res.status(200).json(result)
        } catch (e) {
        
            res.status(500).json(e)
        }
    },
    getMessage : async (req, res) => {
        const { chatId } = req.params
        try {
            const result = await Message.find({ chatId })
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json(e)
        }
    }
    
}