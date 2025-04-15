const express = require("express");
const cors = require("cors");

const path = require("path");
const serverless = require("serverless-http");
const connectToMongo = require("./db");

const app = express();
const port = 5001;
const appOrigin = "https://vercel-frontend1-gray.vercel.app/";

// Connect to MongoDB
connectToMongo();

// CORS configuration
const corsOptions = {
  origin: [
    "https://vercel-frontend1-gray.vercel.app/",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());



// Routes
app.get("/", (req, res) => {
  res.send("Hello Server Listening");
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api/nft", require("./routes/nft"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/chat", require("./routes/chat"));



// For local testing only (not used by serverless)
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export for serverless deployment
module.exports = app;
module.exports.handler = serverless(app);
