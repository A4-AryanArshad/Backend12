const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://sohialshahid706:L7lmkrweuDF0S4yz@nftmart.utuh6.mongodb.net/?retryWrites=true&w=majority&appName=NFTMART"; // Replace with your MongoDB connection string.

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            // No need to include useNewUrlParser and useUnifiedTopology.
        });
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

module.exports = connectToMongo;






