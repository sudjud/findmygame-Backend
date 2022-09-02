const Chat = require("../models/chat.model");

module.exports.chatsController = {
    createChat : async (req, res) => {
        const newChat = new Chat({
            members : [req.body.senderId, req.body.receiverId]
        })
        try {
            const result = await newChat.save()
            res.status(200).json(result)

        } catch (e) {
            res.status(500).json(e)
        }
    },
    userChats : async (req, res) => { 
        try {
          const chat = await Chat.find({
            members : {$in : [req.params.userId]}
          })  
          res.status(200).json(chat)
        } catch (e) {
            res.status(500).json(e)
        }
    },
    findChat : async (req, res) => {
       try {
         const chat = await Chat.findOne({
            members : {$all: [req.params.firstId, req.params.secondId]}
         })
         res.status(200).json(chat)
       } catch (e) {
        res.status(500).json(e)
    }
    }
}