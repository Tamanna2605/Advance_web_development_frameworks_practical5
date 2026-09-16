const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Task = require("./models/Task");

const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: "http://localhost:5173"
}));

// Middleware to parse JSON
app.use(express.json());

/////////////////////////////////////////////////
// Global Logging Middleware
/////////////////////////////////////////////////

app.use((req, res, next) => {

    console.log(
        `${req.method} ${req.url} - ${new Date().toISOString()}`
    );

    next();
});

/////////////////////////////////////////////////
// Content-Type Middleware
/////////////////////////////////////////////////

app.use((req, res, next) => {

    if (
        (req.method === "POST" || req.method === "PUT") &&
        !req.is("application/json")
    ) {
        return res.status(400).json({
            message: "Content-Type must be application/json"
        });
    }

    next();
});

/////////////////////////////////////////////////
// GET All Tasks
/////////////////////////////////////////////////

app.get("/tasks", async (req, res, next) => {

    try {

        const tasks = await Task.find();

        res.status(200).json(tasks);

    } catch (err) {

        next(err);

    }

});

/////////////////////////////////////////////////
// GET Single Task
/////////////////////////////////////////////////

app.get("/tasks/:id", async (req, res, next) => {

    try {

        const task = await Task.findById(req.params.id);

        if (!task) {

            return res.status(404).json({
                message: "Task not found"
            });

        }

        res.status(200).json(task);

    } catch (err) {

        next(err);

    }

});

/////////////////////////////////////////////////
// POST Create Task
/////////////////////////////////////////////////

app.post("/tasks", async (req, res, next) => {

    try {

        const newTask = await Task.create(req.body);

        res.status(201).json(newTask);

    } catch (err) {

        next(err);

    }

});

/////////////////////////////////////////////////
// PUT Update Task
/////////////////////////////////////////////////

app.put("/tasks/:id", async (req, res, next) => {

    try {

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTask) {

            return res.status(404).json({
                message: "Task not found"
            });

        }

        res.status(200).json(updatedTask);

    } catch (err) {

        next(err);

    }

});

/////////////////////////////////////////////////
// DELETE Task
/////////////////////////////////////////////////

app.delete("/tasks/:id", async (req, res, next) => {

    try {

        const deletedTask = await Task.findByIdAndDelete(
            req.params.id
        );

        if (!deletedTask) {

            return res.status(404).json({
                message: "Task not found"
            });

        }

        res.status(200).json({
            message: "Task deleted successfully",
            task: deletedTask
        });

    } catch (err) {

        next(err);

    }

});

/////////////////////////////////////////////////
// 404 Handler
/////////////////////////////////////////////////

app.use((req, res) => {

    res.status(404).json({

        success: false,
        message: "Route Not Found"

    });

});

/////////////////////////////////////////////////
// Global Error Handler
/////////////////////////////////////////////////

app.use((err, req, res, next) => {

    console.error(err);

    // Mongoose validation error
    if (err.name === "ValidationError") {

        const errors = {};

        for (const field in err.errors) {

            errors[field] = err.errors[field].message;

        }

        return res.status(400).json({

            success: false,
            error: "Validation failed",
            details: errors

        });

    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {

        return res.status(400).json({

            success: false,
            error: "Invalid Task ID"

        });

    }

    // Other errors
    res.status(500).json({

        success: false,
        message: "Something went wrong"

    });

});

/////////////////////////////////////////////////
// MongoDB Connection + Server Start
/////////////////////////////////////////////////

mongoose.connect(process.env.MONGO_URI)
    .then(() => {

        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {

            console.log(`Server running on port ${PORT}`);

        });

    })
    .catch((err) => {

        console.error("MongoDB connection failed:", err);

    });