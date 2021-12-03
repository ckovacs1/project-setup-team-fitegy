const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const axios = require("axios");

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// mockaroo
let mockData;
const getMockData = async () => {
    await axios
        .get("https://my.api.mockaroo.com/post_data.json?key=44aeded0")
        .then(apiResponse => mockData = apiResponse.data) 
        //.catch(err => next(err)) // pass any errors to express

    let newData = mockData.map((post) => {
        return {"name": post.first_name + " " + post.last_name, "location" : post.location}
    })
    return newData
}


// mongoDB 
require('dotenv').config({path:'../.env'});
const mongoose = require("mongoose");
const { Schema } = mongoose;
const MONGODB_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fitegy.w1f4m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(MONGODB_URL);

// check if mongoose is connected to MongoDB
/*
mongoose.connection.on("connected", ()=>{
  console.log("Mongoose is connected!");
})
*/

// Define Schema for each post
const PostSchema = new Schema({
  Name: String,
  Location: String,
  postText: String, 
  Likes: Number
});

// Model for each post
const Post = mongoose.model("Post", PostSchema);


// function for saving the data to MongoDB
const SavePostData = async (content) =>{

    // create data
    let newData = await getMockData();
    const data= {
        Name: newData[0].name,
        Location: newData[0].location,
        postText: content, 
        Likes: 0
    }

    // instance of post model
    const Post1  = new Post(data);

    // save this post to database
    Post1.save((error) =>{
        if(error){
            console.log("Oops something went wrong!")
        }
        else{
            console.log("Data saved to MongoDB!")
        }
    })
}

const { check, validationResult } = require('express-validator'); 
// express code
router.post("/", check("content").isByteLength({max: 130}).withMessage("Too long!") ,async (req, res) => {
    //const title = req.body.title
    const isPrivate = req.body.isPrivate;
    const content = req.body.content;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.send({text: "Invalid Input Type!"});
        console.log({ errors: errors.array() });
    }
    else{
        SavePostData(content);
        console.log(req.body);
        res.send({text: "User Input Received"});
    }
  })


module.exports = router;


// const express = require("express");
// const bodyParser = require("body-parser");
// const router = express.Router();
// const app = express();

// //Here we are configuring express to use body-parser as middle-ware.
// app.use(bodyParser.urlencoded({ limit: '150mb',
// extended:true }));
// app.use(bodyParser.json({limit: '150mb'}));

// //mongoDB code 

// const mongoose = require("mongoose");
// require('dotenv').config({path:'../.env'})
// const {Schema}= mongoose;
// const MONGODB_URL = 'mongodb+srv://${provess.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fitegy.w1f4m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// mongoose.connect(MONGODB_URL);

// // Define Schema for each post
// const PostSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   // fileName: String,
//   // fileType: String,
//   // fileSize: String,
//   // lastModifiedDate: String,
//   selectedFile:
//     {
//         data: Buffer,
//         contentType: String
//     },
//   isPrivate: Boolean
// });

// // Model for each post
// const Post = mongoose.model("Post", PostSchema);

// // function for saving the data to MongoDB
// const SavePostData = async (id) =>{
//   // instance of post model
//   // const post1  = new Post(data);
//   const post1 = await Post.findOne({_id:id})
//   post1.save();
//   // save this post to database
//   // post1.save((error) =>{
//   //     if(error){
//   //         console.log("Oops something went wrong!")
//   //     }
//   //     else{
//   //         console.log("Data saved to MongoDB!")
//   //     }
//   // })
// } 
// // function for saving the data to MongoDB



// router.post("/", (req, res) => {
//     console.log(req.body.text);
//   // res.send({text: "begin posting"});
//     const title = req.body.title
//     const content = req.body.content
//     // const dates = req.body.date
//     const isPrivate = req.body.isPrivate
//     // const fileName = req.body.fileName
//     // const desc = req.body.desc
//     const selectedFile = req.body.selectedFile
//     // now do something amazing with this data...
//     // ... then send a response of some kind
//     SavePostData(req.body.id);
//     res.send({text: "User Input Received"});
//   })


// module.exports = router;
