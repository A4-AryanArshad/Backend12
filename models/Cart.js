const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true, 
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
    Token:
  {
    type: Number,
    required: true,
  },


});

// Export the Cart model
const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
