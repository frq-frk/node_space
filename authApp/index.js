const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config')

const app = express();

const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts')

const port = process.env.PORT || 3000;

const dburl = process.env.DB_URL

mongoose.connect(dburl)
.then(() => {
    console.log("Connected to the DB");
})
.catch((e) => {
    console.log("Error occured while connecting to the DB");
    console.log(e);
})

// Middleware
app.use(express.json())

// Router Middleware
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);

app.listen(port, () => {
    console.log("server listening at the port ",port);
})