const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tipSchema = new Schema({
  user_id: {
      type: String,
      required: true
  },
  points: {
      type: Number,
  },
  tips: {
      type: Number,
  }
}, { timestamps: false });

const Tip = mongoose.model('Tip', tipSchema);
module.exports = Tip;