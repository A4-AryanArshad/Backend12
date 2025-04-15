const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

connectToMongo();

const app = express();
const port = 5001;


app.use(cors());
app.use(express.json());

// Existing routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/nft', require('./routes/nft'));
app.use('/api/cart', require('./routes/cart'));

app.use('/api/chat', require('./routes/chat'));

app.listen(port, () => {
    console.log(`NFT Authentication Backend Listening at http://localhost:${port}`);
});