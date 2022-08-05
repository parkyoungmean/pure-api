require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { getUsers, createUser, updateUser, deleteUser } = require('./model/users');
const cors = require('cors');
const path = require("path");

const app = express();

const schoolRoute = require('./routes/school');           // school 라우트를 추가
const noticeRoute = require('./routes/notice');           // notice 라우트를 추가
const publicityRoute = require('./routes/publicity');     // publicity 라우트를 추가

app.use(cors());

//MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Import Router Middlewares
app.use('/school', schoolRoute);           // school 라우트를 추가하고 기본 경로로 /school 사용
app.use('/notice', noticeRoute);           // notice 라우트를 추가하고 기본 경로로 /notice 사용
app.use('/publicity', publicityRoute);           // publicity 라우트를 추가하고 기본 경로로 /publicity 사용

const PORT = 4000;
const HOST = "localhost";


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

/* Upload Image */
/* app.post('/image/uploadImage', async (req, res) => {
    const id = req.body.id;

    console.log('uploadImage:', req);
    console.log('uploadImageName:', req.body);
    
    
    try {
        uploadFile(req.file);
        const response = await deleteUser(id);

        console.log(response);
        console.log("DELETE SUCCESS!");
        res.json(response);
    } catch (error) {
        console.error(error);
    }
}); */



/* async function uploadFile(file) {
    const fileInput = document.getElementById("upload");
    const upload = (file) => {
        if (file && file.size < 5000000) {
            const formData = new FormData();

            formData.append("image", file);
            try {
                await axios.post("https://api.imgur.com/3/image", {
                method: "POST",
                headers: {
                    Authorization: "Client-ID 65a266c7ee29bf5",
                    Accept: "application/json",
                },
                body: formData,
                body: file,
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log(response);
                    // do Something
                });
        } else {
            console.error("파일 용량 초과");
        }
    };

    fileInput &&
        fileInput.addEventListener("change", () => {
            upload(fileInput.files[0]);
        });
            } catch (error) {
                console.error(error);
            }
            
}

uploadFile(); */






app.listen(process.env.PORT, () => {
    console.log("Starting proxy at " + HOST + ":" + process.env.PORT);
})