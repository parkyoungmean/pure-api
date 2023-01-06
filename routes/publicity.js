const express = require('express');
const FormData = require('form-data');
const axios = require('axios');
const router = express.Router();
const app = express();

app.use(express.json())

const { getPublicitys, createPublicity, updatePublicity, deletePublicity } = require('../model/publicitys');

router.get('/', async (req, res) => {
    const publicitys = await getPublicitys();
    /* console.log('publicitys:', publicitys); */
    res.json(publicitys);
});

/* create - 슬라이드 광고 추가를 위한 메서드 */
router.post('/createPublicity', async (req, res) => {
    console.log('여기는 슬라이드 광고 추가 라우터입니다.');
    
    /* console.log(req.body); */

    const img = req.body.img;
    const mobileImg = req.body.mobileImg;
    
    const texts = JSON.stringify(req.body.texts);
    const condition = req.body.condition;                    // 광고 or 공지
    const belong = "전체";                                    // 전체 or ~학교
    const author = "관리자";
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;

    /* console.log('img 파일 내용:', img);
    console.log('mobileImg 파일 내용:', mobileImg); */

    try {

       /*  uploadFile(JSON.parse(img)); */

        const response = await createPublicity(img, mobileImg, texts, condition, belong, author, createdAt, updatedAt);

        console.log('결과:', response);
        console.log('CREATE SUCCESS PUBLICITY!');
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});


/* Update Publicity - 슬라이드 광고 내용 수정을 위한 메서드 */
router.post('/updatePublicity', async (req, res) => {
    console.log('여기는 광고내용 수정 라우터입니다.');
    console.log(req.body);

    const id = req.body.id;

    const img = req.body.img;
    const mobileImg = req.body.mobileImg;
    
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const content = req.body.description;
    const condition = req.body.condition;                    // 광고 or 공지
    const belong = req.body.belong;                                    // 전체 or ~학교
    const author = req.body.author;
    const position = JSON.stringify(req.body.position);      // 전체 글의 x, y의 위치
    const size = JSON.stringify(req.body.size);              // 전체 글의 글자 크기
    const color = JSON.stringify(req.body.color);            // 전체 글의 글자색
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;

    console.log('img 파일 내용:', img);
    console.log('mobileImg 파일 내용:', mobileImg);
    
    try {
        const response = await updatePublicity(id, img, mobileImg, title, subtitle, content, condition, belong, author, position, size, color, createdAt, updatedAt,);

        /* console.log(response); */
        console.log('UPDATE SUCCESS Publicity!');
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

/* Delete Publicity - 슬라이드 광고 삭제를 위한 메서드 */
router.post('/deletePublicity', async (req, res) => {
    const id = req.body.id;

    try {
        const response = await deletePublicity(id);

        /* console.log(response); */
        console.log("PUBLICITY DELETE SUCCESS!");
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
