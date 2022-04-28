require('dotenv').config();
const express = require('express');
const { getUsers, createUser } = require('./model/users');
const cors = require('cors');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const path = require("path");
const app = express();


app.use(cors());

const PORT = 4000;
const HOST = "localhost";


// GET request
app.get('/users', async (req, res) => {
    const users = await getUsers();
    res.json(users);
})


// POST request
// POST name, phhoneNumber, extraInfo
// Functionality: Make a database entry in a Notion page with the databaseId above
// localhost:4000/submitFormToNotion
app.post('/createUser', jsonParser, async (req, res) => {
    // req.body
    /* {
        name: "peter",
        phoneNumber: "000-0000-0000",
        extraInfo: "this is Infomation",
    } */
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const img = req.body.img;
    const greetings = req.body.greetings;
    const extraInfo = req.body.extraInfo;
    const createdAt = req.body.createdAt;
    const bookmark = req.body.bookmark;
    
    try {
        const response = await createUser(name, phoneNumber, img, greetings, extraInfo, createdAt, bookmark);
        
        console.log(response);
        console.log("SUCCESS!")
    } catch (error) {
        console.error(error);
    }
});

app.listen(process.env.PORT, () => {
    console.log("Starting proxy at " + HOST + ":" + process.env.PORT);      // localhost:4000
})