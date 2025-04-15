require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const serverless = require("serverless-http");
const connectToMongo = require("./db");

const app = express();
const port = process.env.SERVER_PORT || 5000;
const appOrigin = process.env.REACT_APP_API_ORIGIN;

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
app.use(morgan("dev"));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Hello Server Listening");
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api/nft", require("./routes/nft"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/chat", require("./routes/chat"));

// Static file serving
app.use(express.static(path.join(__dirname, "build")));
app.use(
  "/images",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", appOrigin);
    next();
  },
  express.static(path.join(__dirname, "public/images"))
);

// For local testing only (not used by serverless)
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export for serverless deployment
module.exports = app;
module.exports.handler = serverless(app);
