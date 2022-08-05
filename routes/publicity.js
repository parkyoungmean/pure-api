const express = require('express');
const FormData = require('form-data');
const axios = require('axios');
const router = express.Router();
const app = express();

app.use(express.json())

const { getPublicitys, createPublicity } = require('../model/publicitys');

router.get('/', async (req, res) => {
    const publicitys = await getPublicitys();
    console.log('publicitys:', publicitys);
    res.json(publicitys);
});

/* create - 슬라이드 광고 추가를 위한 메서드 */
router.post('/createPublicity', async (req, res) => {
    console.log('여기는 슬라이드 광고 추가 라우터입니다.');
    console.log(req.body);

    const img = req.body.img;
    const mobileImg = req.body.mobileImg;

    /* if (req.body.mobileImg.length === 0) {
        const mobileImg = req.body.img;
    } */
    
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const content = req.body.description;
    const condition = req.body.condition;                    // 광고 or 공지
    const belong = "전체";                                    // 전체 or ~학교
    const author = "관리자";
    const size = JSON.stringify(req.body.size);
    const color = JSON.stringify(req.body.color);
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;

    console.log('img 파일 내용:', img);
    console.log('mobileImg 파일 내용:', mobileImg);

    try {

       /*  uploadFile(JSON.parse(img)); */

        const response = await createPublicity(img, mobileImg, title, subtitle, content, condition, belong, author, size, color, createdAt, updatedAt);

        console.log('결과:', response);
        console.log('CREATE SUCCESS PUBLICITY!');
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});


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



module.exports = router;
