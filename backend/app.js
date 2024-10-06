require('dotenv').config()
const express = require("express");
const app = express();
// const PORT = process.env.PORT || 3000;

const jobRouter = require("./routes/jobRouter");
const userRouter = require("./routes/userRouter");
const { unknownEndpoint,errorHandler } = require("./middleware/customMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");

// Middlewares
app.use(cors())
app.use(express.json());

connectDB();

// Use the jobRouter for all "/jobs" routes
app.use("/api/jobs", jobRouter);
// Use the userRouter for all "/users" routes
app.use("/api/users", userRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`)

module.exports = app;

