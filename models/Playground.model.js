const mongoose = require('mongoose');

const plaugroundSchema = mongoose.Schema({
  name: { type: String, require: true },
  address: String,
  coordinates: { type: String, require: true },
  schedule: { type: String, require: true, default: '24' },
  surface: { type: String, require: true },
  covered: { type: Boolean, require: true },
  reviews: [
    {
      stars: Number,
      text: { type: String, require: true },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  facilities: {
    shower: { type: Boolean, default: false },
    dressroom: { type: Boolean, default: false },
    lighting: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    inventory: { type: Boolean, default: false }
  },
  price: { type: Number, require: true },
  booking: [
    {
      date: mongoose.Schema.Types.Date,
      time: { type: String, default: '1h' }
    }
  ],
  sport: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Sport'
  },
  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image'
    }
  ]
});

const Playground = mongoose.model('Playground', plaugroundSchema);

module.exports = Playground;