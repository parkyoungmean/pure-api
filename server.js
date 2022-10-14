require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { getUsers, createUser, updateUser, deleteUser } = require('./model/users');
const cors = require('cors');
const path = require("path");
const usetube = require('usetube');

const app = express();

const schoolRoute = require('./routes/school');           // school 라우트를 추가
const noticeRoute = require('./routes/notice');           // notice 라우트를 추가
const publicityRoute = require('./routes/publicity');     // publicity 라우트를 추가
const galleryRoute = require('./routes/gallery');             // gallery 라우트를 추가
const worshipRoute = require('./routes/worship');             // worship 라우트를 추가

app.use(cors());

//MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Import Router Middlewares
app.use('/school', schoolRoute);                  // school 라우트를 추가하고 기본 경로로 /school 사용
app.use('/notice', noticeRoute);                  // notice 라우트를 추가하고 기본 경로로 /notice 사용
app.use('/publicity', publicityRoute);            // publicity 라우트를 추가하고 기본 경로로 /publicity 사용
app.use('/gallery', galleryRoute);                // gallery 라우트를 추가하고 기본 경로로 /gallery 사용

app.use('/worship', worshipRoute);                // worship 라우트를 추가하고 기본 경로로 /worship 사용

const PORT = 4000;
const HOST = "localhost";





/* 
async function searchYtInfo() {
    const data = await usetube.searchChannel('순전한교회ThePureMinistry');

    console.log(data);
}

searchYtInfo(); 
*/

/* 
async function searchYtInfo() {
    const data = await usetube.searchChannel('순전한교회ThePureMinistry');

    console.log(data);
}
*/

/* 
async function searchYtInfo() {
    const data = await usetube.getVideoDesc('SOjT9l7hmxg');

    console.log(data);
}

searchYtInfo(); 
*/



/*
async function searchYtInfo3() {
    const data = await usetube.getVideosFromDesc('SOjT9l7hmxg');

    console.log(data);
} 
*/

/* searchYtInfo3(); */

async function searchYtInfo2() {
    /* const data = await usetube.getVideoDesc('kIO4DObBXoU'); */
   /*  const data = await usetube.getPlaylistVideos('PL13DkA-MmUMtDgdl9Gz_lU5iJ5lWPBEM-'); */
    /* const data = await usetube.getPlaylistVideos('PL13DkA-MmUMucJ-IKlGndvVmnN9wYKl7_'); */
    /* const data = await usetube.getPlaylistVideos('PL13DkA-MmUMsnKR6z_yJlhPYtHlgWG1uF', 0); */
    /* const data = await usetube.getPlaylistVideos('PL13DkA-MmUMt1JP_r1sH_lnrZ0JpZl8GF', 0); */

    /* console.log(data); */
}

/* searchYtInfo2(); */

// GET request
app.get('/users', async (req, res) => {
    const users = await getUsers();
    res.json(users);
})


// POST request
/* Create User */
app.post('/createUser', async (req, res) => {
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
app.post('/updateUser', async (req, res) => {
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

/* Delete User */
app.post('/deleteUser', async (req, res) => {
    const id = req.body.id;

    try {
        const response = await deleteUser(id);

        console.log(response);
        console.log("DELETE SUCCESS!");
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});


app.listen(process.env.PORT, () => {
    console.log("Starting proxy at " + HOST + ":" + process.env.PORT);
})