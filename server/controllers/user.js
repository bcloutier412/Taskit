const userRouter = require("express").Router();
const User = require("../models/user");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../utils/config");

userRouter.post("/register", async (request, response) => {
    const { username, name, password } = request.body;

    // Check to make sure the user sent a username and password
    if (!(username && password && name))
        return response.status(400).send({ error: "Missing required data " });

    try {
        // If the user already exists send an error to the client
        let result = await User.findOne({ username });

        if (result)
            return response
                .status(409)
                .send({ error: "Username already exists" });

        // Create a new user object and save that user to the database
        const newUser = new User({
            username,
            name,
            passwordHash: await bcrypt.hash(password, 10),
        });

        const user = await newUser.save();

        // Creating Token to send back to client
        const userForToken = {
            username: user.username,
            id: user.id,
        };

        const token = JWT.sign(userForToken, config.SECRET, {
            expiresIn: "1hr",
        });

        return response
            .status(200)
            .send({ token, username: user.username, name: user.name });
    } catch (error) {
        console.log(error);
        return response
            .status(404)
            .send({ error: "Request resulted in an error " });
    }
    // Create a new user object and add it to the database with the password being incyrpted using bcrypt

    // Create JWT token and send it back to the user from the data that is returned back from mongodb.
});

module.exports = userRouter;
