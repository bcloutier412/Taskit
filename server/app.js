const express = require("express");
const app = express();
const config = require("./utils/config.js");
const logger = require("./utils/logger.js");
const cors = require("cors");
const mongoose = require("mongoose");
const { requestLogger } = require("./utils/middleware")

// Routes
const userRouter = require('./controllers/user')
const todoRouter = require('./controllers/todo')

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
app.use(requestLogger);
app.use("/api/user", userRouter);
app.use("/api/todo", todoRouter);

module.exports = app;