const todoRouter = require("express").Router();
const User = require("../models/user");
const Todo = require("../models/todo");
const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const config = require("../utils/config");
const verifyToken = require("../utils/verifyToken");

todoRouter.get("/todos", verifyToken, async (request, response) => {
    const user = request.user;
    try {
        // Fetching user from db
        const result = await User.findOne({ _id: user.id }).populate("todos");

        // If the user doesn't exist respond with an error
        if (!result) {
            return response
                .status(404)
                .send({ error: "Request resulted in an error" });
        }
        
        // Send back the todos
        return response.send(result.todos);

    } catch (error) {
        console.log(error);
        return response
            .status(404)
            .send({ error: "Request resulted in an error" });
    }
});

todoRouter.post('/todo', verifyToken, (request, response) => {
    console.log(request.body)
    // The user will send the new note 
    // user will also send authorization header
})
// Add new note to database
// Mark note as finished in database

module.exports = todoRouter;
