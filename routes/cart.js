const express = require('express');
const CART = require('../models/Cart');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const multer = require('multer');
const NFT = require('../models/Nft');

const path = require('path');

const router = express.Router();

router.post('/cart', fetchuser, async (req, res) => {
  
  try {
    const { imgpath, nftname, description, price, category,token } = req.body;
    console.log("respose come ", imgpath, nftname, description, price, category,token);

    // Check if the NFT already exists in the user's cart
    const existingNft = await CART.findOne({ user: req.user.id, nftname });
    
    if (existingNft) {
      return res.status(400).json({ error: "You have already added this NFT to your cart." });
    }

    // Create a new NFT object
    const cart = new CART({
      user: req.user.id,
      imgpath,
      nftname,
      description,
      price,
    
      Token:token,
     
      Catagory:category
    });

    const savedNft = await cart.save();
    
    console.log("Add to cart Successfully");
    res.json(savedNft);
  
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

});


router.post('/cartcheck', fetchuser, async (req, res) => {
  try {
    const { nftname } = req.body;
    // Check if the NFT already exists in the user's cart
    const existingNft = await CART.findOne({ user: req.user.id, nftname });
    
    // Return a JSON response indicating whether it exists
    return res.json({ inCart: existingNft ? true : false });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.delete('/deletebyimgpath', fetchuser, async (req, res) => {
  try {
    const { imgpath } = req.body; // Extract imgpath from the request body

    if (!imgpath) {
      return res.status(400).json({ success: false, message: "imgpath is required" });
    }

    // Delete the NFT with the given imgpath for the logged-in user
    const deletedNFT = await CART.findOneAndDelete({ user: req.user.id, imgpath });

    if (!deletedNFT) {
      return res.status(404).json({ success: false, message: "NFT not found in your cart" });
    }

    res.json({
      success: true,
      message: "NFT deleted successfully from the cart",
      deletedNFT
    });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});




router.get('/fetchall', fetchuser, async (req, res) => {
  try {
    // Fetch all NFTs associated with the logged-in user
    const cart = await CART.find({ user: req.user.id });
    res.json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


router.delete('/deletenftcart', async (req, res) => {
  try {
    const { imgpath } = req.body; // Extract imgpath from the request body

    // Validate if imgpath is provided
    if (!imgpath) {
      return res.status(400).json({ success: false, message: "imgpath is required" });
    }

    // Delete all NFTs matching the given imgpath, regardless of user
    const deletedNFTs = await CART.deleteMany({ imgpath });

    // Check if any NFTs were deleted
    if (deletedNFTs.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "No NFTs found with the provided imgpath" });
    }

    res.json({
      success: true,
      message: `${deletedNFTs.deletedCount} NFT(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



router.post('/buynft', fetchuser, async (req, res) => {
  
  try {
    const { imgpath, nftname, description, price,token,category } = req.body;

    console.log("data come from front end ", imgpath, nftname, description, price,token,category)

    // Create a new NFT object
    const nft = new NFT({
      user: req.user.id,
      imgpath,
      nftname,
      description,
      price,
   
      Token:token,
      Catagory:category,
      mode:'Owned',
      validity:'Owned'
    });

    // Save the NFT to the database
    const savedNft = await nft.save();
    
    console.log("Buy Nft Successfully")
    res.json(savedNft);
  
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }

});


module.exports = router;
