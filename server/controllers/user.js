const userRouter = require("express").Router();
const User = require("../models/user");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../utils/config");

userRouter.post("/register", async (request, response) => {
    const { username, name, password } = request.body;

    // Check to make sure the user sent a username, password, and name
    if (!(username.trim() && password.trim() && name.trim()))
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
        const token = createJWTToken(user);

        return response
            .status(200)
            .send({ token, username: user.username, name: user.name });

    } catch (error) {
        console.log(error);
        return response
            .status(404)
            .send({ error: "Request resulted in an error" });
    }
});

userRouter.post("/login", async (request, response) => {
    const { username, password } = request.body;

    // Check to make sure the client sent a username and password
    if (!(username.trim() && password.trim()))
        return response.status(400).send({ error: "Missing required data " });

    try {
        // Look for username in the database
        const user = await User.findOne({ username });

        if (!user)
            return response
                .status(404)
                .send({ error: "Invalid username or password" });

        // Check to see the user gave the correct password
        const isValidLogin = await bcrypt.compare(password, user.passwordHash);

        if (!isValidLogin)
            return response
                .status(401)
                .send({ error: "Invalid username or password" });

        // User credentials were correct so we will send back a JWT token        
        // Creating Token to send back to client
        const token = createJWTToken(user);

        return response
            .status(200)
            .send({ token, username: user.username, name: user.name });

    } catch (error) {
        console.log(error);
        return response
            .status(404)
            .send({ error: "Request resulted in an error " });
    }
});

const createJWTToken = (user) => {
    const userForToken = {
        username: user.username,
        id: user.id,
    };
    const token = JWT.sign(userForToken, config.SECRET, {
        expiresIn: "10min",
    });
    return token;
};

module.exports = userRouter;
