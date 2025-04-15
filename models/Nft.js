const mongoose = require('mongoose');
const { Schema } = mongoose;

const NftSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  imgpath: {
    type: String,
    required: true,
  },
  nftname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  Catagory:
  {
    type: String,
    required: true,
  },

  mode: {
    type: String,

  },

  Token:
  {
    type: Number,
    required: true,
  },

  validity:{
    type: String,
  }
});

const NFT = mongoose.model('NFT', NftSchema);
module.exports = NFT;
