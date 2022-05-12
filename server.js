require('dotenv').config();
const express = require('express');
const { getUsers, createUser, updateUser } = require('./model/users');
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
/* Create User */
app.post('/createUser', jsonParser, async (req, res) => {
    // req.body
    /* {
        email: "example@exam.com"
        name: "peter",
        phoneNumber: "000-0000-0000",
        extraInfo: "this is Infomation",
    } */
    const name = req.body.name;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const img = req.body.img;
    const greetings = req.body.greetings;
    const extraInfo = req.body.extraInfo;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;
    const bookmark = req.body.bookmark;
    
    try {
        const response = await createUser(name, email, phoneNumber, img, greetings, extraInfo, createdAt, updatedAt, bookmark);
        
        console.log(response);
        console.log("CREATE SUCCESS!");
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

/* Update User */
app.post('/updateUser', jsonParser, async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const img = req.body.img;
    const greetings = req.body.greetings;
    const extraInfo = req.body.extraInfo;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;
    const bookmark = req.body.bookmark;
    
    try {
        const response = await updateUser(id, name, email, phoneNumber, img, greetings, extraInfo, createdAt, updatedAt, bookmark);
        
        console.log(response);
        console.log("UPDATE SUCCESS!");
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

app.listen(process.env.PORT, () => {
    console.log("Starting proxy at " + HOST + ":" + process.env.PORT);
})