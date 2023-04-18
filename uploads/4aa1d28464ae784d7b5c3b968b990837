const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoutes = require('./routes/user')
const documentRoutes = require("./routes/document")
const cors = require('cors');




//config for .env file
require("dotenv").config();

const app = express();
app.use(cors());

app.use(cors({ origin: 'http://localhost:3000' }));


const PORT = process.env.PORT;

// app.get("/",(req, res)=>{
//     res.send("Home page  '''''");
// })
const cloudinary = require('cloudinary').v2;

// configure Cloudinary SDK
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });
  

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})



// routes
app.use('/', userRoutes);
app.use('/api/document', documentRoutes);

//static files
app.use(express.static(path.join(__dirname, "./frontend/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});


app.listen(PORT,()=>{
    console.log(`sever is running on ${PORT}`)
});







// Connect MongoDb

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connected to MongoDb");
})
.catch((err)=>{
        console.error("Could not conneted to MongoDb..",err)
});