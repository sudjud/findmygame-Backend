const path = require('path')
const Image = require('../models/Images.model');

module.exports.imageController = {
  upload: async (req, res) => {
    let images = req.files.plgImage
    images = images.length ? images : [images]
    let newImages = [];
    try {
      for (let image of images) {
        const randName = Math.round(Math.random() * 100000000000);
        const uploadPath = path.resolve('uploads', 'images', `${randName}${image.name}`)
        try {
          image.mv(uploadPath);
          let newImage = await Image.create({
            name: `${randName}${image.name}`
          })
          newImages.push(newImage._id)
        } catch (e) {
          res.json(e)
        }
      }
      res.json(newImages);  
    } catch (e) {
      res.json(e);
    }
  }
}