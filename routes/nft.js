const express = require('express');
const NFT = require('../models/Nft');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();


router.post('/addnft', fetchuser, [
  body('nftname', 'Enter a valid title, minimum length 3 characters').isLength({ min: 3 }),
  body('description', 'Enter a valid description, minimum length 5 characters').isLength({ min: 5 }),
  body('price', 'Enter a price, greater than 0').isFloat({ gt: 0 }),
 

], async (req, res) => {
  try {
   
    const { imgpath, nftname, description, price,category,token_id } = req.body;

 

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const nft = new NFT({
      user: req.user.id,
      imgpath,
      nftname,
      description,
      price,
      Catagory:category,
      mode:"created",
      Token:token_id,
      validity:'Created'
    });

    // Save the NFT to the database
    const savedNft = await nft.save();
    
    // Return the saved NFT as a response
    res.json(savedNft);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
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




router.post('/updatename', fetchuser, async (req, res) => {
  try {
    const { imgpath, nftname } = req.body;

    // Validate input
    if (!imgpath || !nftname) {
      return res.status(400).json({
        success: false,
        error: "Image path and NFT name are required"
      });
    }

    // Find the NFT
    const nft = await NFT.findOne({ imgpath, user: req.user.id });
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found or you do not own this NFT'
      });
    }

    // Check if NFT is listed
    if (nft.mode === 'list') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update name: NFT is currently listed'
      });
    }

    // Validate name length
    if (nftname.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Name must contain at least 2 characters'
      });
    }

    // Update and save
    nft.nftname = nftname.trim();
    await nft.save();

    return res.json({
      success: true,
      message: 'Name updated successfully',
      nft
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});




router.post('/updatedescription', fetchuser, async (req, res) => {
  try {
    const { imgpath, description } = req.body;

    // Validate input
    if (!imgpath || !description) {
      return res.status(400).json({
        success: false,
        error: "Image path and description are required"
      });
    }

    // Find the NFT
    const nft = await NFT.findOne({ imgpath, user: req.user.id });
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found or you do not own this NFT'
      });
    }

    // Check if NFT is listed
    if (nft.mode === 'list') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update description: NFT is currently listed'
      });
    }

    // Validate description length
    if (description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Description must contain at least 10 characters'
      });
    }

    // Update and save
    nft.description = description.trim();
    await nft.save();

    return res.json({
      success: true,
      message: 'Description updated successfully',
      nft
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});


router.post('/list', fetchuser, async (req, res) => {
  try {
    const { imgpath } = req.body;

    // Validate the image path
    if (!imgpath) {
      return res.status(400).json({ 
        success: false,
        error: "Image path is required to list the NFT." 
      });
    }

    // Find the NFT by its imgpath and user's ID
    const nft = await NFT.findOne({ imgpath, user: req.user.id });
    
    if (!nft) {
      return res.status(404).json({ 
        success: false,
        error: "NFT not found." 
      });
    }

    // Check if already listed
    if (nft.mode === 'list') {
      return res.status(400).json({
        success: false,
        message: "NFT is Already Listed"
      });
    }

    // Update the mode to "list"
    nft.mode = 'list';
    await nft.save();

    res.json({ 
      success: true,
      message: "NFT successfully listed!", 
      nft 
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});


// Get NFT details endpoint
router.post('/getnft', fetchuser, async (req, res) => {
  try {
    const { imgpath } = req.body;
    
    if (!imgpath) {
      return res.status(400).json({ error: "Image path is required" });
    }

    const nft = await NFT.findOne({ imgpath, user: req.user.id });
    
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    res.json({ nft });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});










router.post('/updateprice', fetchuser, async (req, res) => {
  try {
    const { imgpath, price } = req.body;

    // Validate input
    if (!imgpath || !price) {
      return res.status(400).json({
        success: false,
        error: "Image path and price are required"
      });
    }

    // Validate price format
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      return res.status(400).json({
        success: false,
        error: "Price must be a valid number"
      });
    }

    // Find the NFT
    const nft = await NFT.findOne({ imgpath, user: req.user.id });
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        error: 'NFT not found or you do not own this NFT'
      });
    }

    // Check if NFT is listed
    if (nft.mode === 'list') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update price: NFT is already listed'
      });
    }

    // Update and save
    nft.price = numericPrice;
    await nft.save();

    return res.json({
      success: true,
      message: 'Price updated successfully',
      nft
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});














router.get('/fetchallnft', fetchuser, async (req, res) => {
    try {
        // Fetch NFTs where user matches the logged-in user and validity is "created"
        const nfts = await NFT.find({ user: req.user.id, validity: "Created" });
        res.json(nfts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/fetchallmall', async (req, res) => {
  try {
    // Fetch all NFTs that are in "list" mode (no user-specific filter)
    const nfts = await NFT.find({
      mode: 'list'
    });
    res.json(nfts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route to fetch all NFTs for a user with mode "list"
router.get('/fetchalllist', fetchuser, async (req, res) => {
  try {
      // Fetch NFTs where user matches the logged-in user and mode is "list"
      const nfts = await NFT.find({ user: req.user.id, mode: "list" });
      res.json(nfts);
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
});







// Route to get the current owner based on imgpath
router.post('/getowner', async (req, res) => {
  try {
    const { imgpath } = req.body;

    const nft = await NFT.findOne({ imgpath });
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }

    return res.json({ ownerId: nft.user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


router.post('/getownernft', async (req, res) => {
  try {
    const { user, imgpath } = req.body; // Destructure user and imgpath from the request body

    // Validate the user field
    if (!user) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    // Build query conditionally
    const query = { user: user, mode: "list" };
    if (imgpath) {
      query.imgpath = { $ne: imgpath }; // Exclude NFTs with the given imgpath
    }

    // Fetch NFTs matching the criteria
    const nfts = await NFT.find(query);

    // If no NFTs match the criteria
    if (!nfts || nfts.length === 0) {
      return res.status(404).json({ success: false, message: 'No NFTs found for the provided criteria.' });
    }

    // Return the filtered NFTs
    res.json({ success: true, data: nfts });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});




router.post('/getownersold', async (req, res) => {
  try {
    const { imgpath } = req.body;

    // Check if imgpath is provided
    if (!imgpath) {
      return res.status(400).json({ error: 'Image path is required' });
    }

    // Find the NFT with matching imgpath and mode "sold"
    const nft = await NFT.findOne({ imgpath, mode: 'Sold' });
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found or not sold' });
    }

    // Respond with the owner's ID
    return res.json({ ownerId: nft.user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});






// Route to update the previous owner's NFT status to "Sold"
router.post('/updateowner', fetchuser, async (req, res) => {
  try {
    const { ownerId, imgpath, validity,mode } = req.body;

    const nft = await NFT.findOne({ imgpath, user: ownerId });
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found for the user' });
    }

    nft.validity = validity; 
    nft.mode=mode
    await nft.save();

    return res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});








































// Route to fetch NFTs with validity "Owned" for a user
router.get('/fetchallowned', fetchuser, async (req, res) => {
  try {
      // Fetch NFTs where user matches the logged-in user and validity is "Owned"
      const nfts = await NFT.find({
          user: req.user.id,
          validity: "Owned"
      });
      res.json(nfts);
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
});




router.get('/fetchallsoldnft', fetchuser, async (req, res) => {
    try {
        // Fetch NFTs where user matches the logged-in user and validity is "created"
        const nfts = await NFT.find({ user: req.user.id, mode: "Sold" });
        res.json(nfts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});





router.get('/fetchall', fetchuser, async (req, res) => {
  try {
    console.log("User ID from fetchuser:", req.user.id); // Debugging

    const nfts = await NFT.find({
      user: { $ne: req.user.id },
      mode: 'list'
    });

    console.log("All NFTs:", nfts); // Debugging
    res.json(nfts);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


router.delete('/sold/:id', fetchuser, async (req, res) => {
  try {

    let nft = await NFT.findById(req.params.id);

 
    if (!nft) {
      return res.status(404).json({ error: 'NFT not found' });
    }


    if (nft.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Access denied' });
    }

    nft.validity = 'Sold';
    nft.mode = 'Sold';

    // Save the updated NFT
    await nft.save();

    // Send the updated NFT as a response
    res.json({ success: 'NFT marked as sold', nft });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});















router.delete('/deletenft/:id', fetchuser, async (req, res) => {
    try {
      // Log the delete request
      console.log('Delete request received for NFT ID:', req.params.id);
  
      // Find the NFT to be deleted
      let nft = await NFT.findById(req.params.id);
      if (!nft) {
        console.log('NFT not found');
        return res.status(404).json({ error: 'NFT not found' });
      }
  
      console.log('NFT found:', nft);
  
      // Allow deletion only if the user owns this NFT
      if (nft.user.toString() !== req.user.id) {
        console.log('User not authorized to delete this NFT');
        return res.status(401).json({ error: 'Access denied' });
      }
  
      console.log('User authorized, deleting NFT...');
  
      // Delete the NFT
      await NFT.findByIdAndDelete(req.params.id);
  
      console.log('NFT deleted successfully');
  
      // Send a success response
      res.json({ success: 'NFT has been deleted', nft });
    } catch (error) {
      console.error('Error during NFT deletion:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });









  router.put('/updatenft/:id', fetchuser, async (req, res) => {


    const { nftname, description, price } = req.body;

    // Create a newnft object
    const newnft = {};
    if (nftname) { newnft.nftname = nftname; }
    if (description) { newnft.description = description; }
    if (price) { newnft.price = price; }
   

    try {
        // Find the nft to be updated
        let nft = await NFT.findById(req.params.id);
        if (!nft) {
            return res.status(404).send("nft not found");
        }

        // Ensure only the owner can update the nft
        if (nft.user.toString() !== req.user.id) {
            return res.status(401).send("Access denied");
        }

        // Update the nft
        nft = await NFT.findByIdAndUpdate(req.params.id, { $set: newnft }, { new: true });
        res.json(nft); 

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }


});













module.exports = router;
