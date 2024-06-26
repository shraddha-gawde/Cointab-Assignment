const express = require('express');
const connection = require('./db');
require("dotenv").config()
const {userRouter} = require("./routes/user.routes");
const {postRouter} = require("./routes/posts.routes");
const cors = require("cors")
const app = express();

// // Middleware
app.use(express.json());
app.use(cors())
// Routes
app.use('/users', userRouter);
app.use('/posts', postRouter);

// Starting server
app.listen(process.env.PORT, async()=>{
    try {
        await connection.authenticate();
        console.log("connected to SQL DB")
        console.log(`Server is running on port ${process.env.PORT}`)
    } catch (error) {
        console.log(error)
    }
    
})