const todoRouter = require("express").Router();
const User = require("../models/user");
const Todo = require("../models/todo");
const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const config = require("../utils/config");
const verifyToken = require("../utils/verifyToken");

todoRouter.get("/todos", verifyToken, async (request, response) => {
    try {
        const user = request.user;
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

todoRouter.post("/todo", verifyToken, async (request, response) => {
    try {
        const { title, description } = request.body.todo;

        if (!title.replace(/\s/g, "")) {
            return response
                .status(400)
                .send({ error: "Missing required data " });
        }
        // Creating new note object for db
        const todo = new Todo({
            title,
            description,
            finished: false,
            user: request.user.id,
        });

        const newTodo = await todo.save();

        // Adding the new Note to the users profile
        const updatedUser = await User.updateOne(
            { _id: request.user.id },
            { $push: { todos: newTodo.id } }
        );

        // Sending the new note back to the client
        return response.status(200).send(newTodo);
    } catch (error) {
        console.log(error);
        return response
            .status(404)
            .send({ error: "Request resulted in an error" });
    }
});

todoRouter.delete("/todo", verifyToken, async (request, response) => {
    try {
        const user = request.user;
        const { todoID } = request.body;

        if (!todoID)
            return response
                .status(400)
                .send({ error: "Missing required data " });

        const deletedTodo = await Todo.deleteOne({
            _id: todoID,
            user: user.id,
        });
        response.end();
    } catch (error) {
        console.log(error);
        return response
            .status(404)
            .send({ error: "Request resulted in an error" });
    }
});

todoRouter.put("/todo", verifyToken, async (request, response) => {
    try {
        const user = request.user;
        const { todoID, isFinished } = request.body;

        if (!(todoID && isFinished))
            return response
                .status(400)
                .send({ error: "Missing required data " });

        await Todo.updateOne({ _id: todoID }, { $set: { finished: isFinished } });
    } catch (error) {
        console.log(error);
        return response
            .status(404)
            .send({ error: "Request resulted in an error" });
    }
});
module.exports = todoRouter;
