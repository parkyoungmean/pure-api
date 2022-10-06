const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json())

const { createWorship } = require('../model/worships');

/* create - 예배 추가를 위한 메서드 */
router.post('/createWorship', async (req, res) => {
    console.log('여기는 예배 추가 라우터입니다.');

    const title = req.body.title;
    const originTitle = req.body.originTitle;
    const verse = req.body.verse;
    const speaker = req.body.speaker;
    const ytUrl = req.body.ytUrl;
    const videoId = req.body.videoId;
    const belong = req.body.belong;
    const author = req.body.author;
    const color = req.body.color;
    const pbDate = req.body.pbDate;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;

    try {
        const response = await createWorship(title, originTitle, verse, speaker, ytUrl, videoId, belong, author, color, pbDate, createdAt, updatedAt);

        console.log(response);
        console.log('WORSHIP CREATE SUCCESS!');
        res.json(response);
    } catch (error) {
        console.error(error);
    } 
});

module.exports = router;