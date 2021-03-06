require('dotenv').config();
const express = require('express');
const { getUsers, createUser } = require('./model/users');
const cors = require('cors');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
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
app.post('/createStudent', jsonParser, async (req, res) => {
    // req.body
    /* {
        name: "peter",
        phoneNumber: "000-0000-0000",
        extraInfo: "this is Infomation",
    } */
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const extraInfo = req.body.extraInfo;

    try {
        const response = await createStudent(name, phoneNumber, extraInfo);
        
        console.log(response);
        console.log("SUCCESS!")
    } catch (error) {
        console.error(error);
    }
});

app.listen(PORT, HOST, () => {
    console.log("Starting proxy at " + HOST + ":" + PORT);      // localhost:4000
})