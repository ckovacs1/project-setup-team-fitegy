const express = require("express");
const router = express.Router();
const axios = require("axios");

let mockData;
const getMockData = async () => {
    await axios
        .get("https://my.api.mockaroo.com/random_names.json?key=44aeded0")
        .then(apiResponse => mockData = apiResponse.data) 
        .then(() => console.log(mockData))
        //.catch(err => next(err)) // pass any errors to express

    let newData = mockData.map((notif) => {
        return {"name": notif.first_name + " " + notif.last_name}
    })
    return newData
}

// mongoDB 
require('dotenv').config({path:'../.env'});
const mongoose = require("mongoose");
const { Schema } = mongoose;
const MONGODB_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@fitegy.w1f4m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(MONGODB_URL);

// Define Schema for each notification
const NotifSchema = new Schema({
    Name: String,
    Text: String
  });
  
// Model for each notification
const Notif = mongoose.model("Notif", NotifSchema);


// function for saving the data to MongoDB
const SaveNotifData = async (text) =>{

    // create data
    let newData = await getMockData();
    const data= {
        Name: newData[0].name,
        Text: text, 
    }

    // instance of post model
    const Notif1  = new Notif(data);

    // save this post to database
    Notif1.save((error) =>{
        if(error){
            console.log("Oops something went wrong!")
        }
        else{
            console.log("Data saved to MongoDB!")
        }
    })
}


router.get('/', async (req, res) => {
    const Notifs = await Notif.find();
    const allNotifs = Notifs.map((notif)=>{
        return {name: notif.Name, text: notif.Text}
      })
    res.json(allNotifs);
})

module.exports = router;
