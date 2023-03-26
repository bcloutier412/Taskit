const express = require("express");
const app = express();
const config = require("./utils/config.js");
const logger = require("./utils/logger.js");
const cors = require("cors");
const mongoose = require("mongoose");

// Routes
const userRouter = require('./controllers/user')

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

// Connecting to database
mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB");
    })
    .catch((error) => {
        logger.error("error connection to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);

module.exports = app;