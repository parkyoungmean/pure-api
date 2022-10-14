const express = require('express');
const router = express.Router();
const usetube = require('usetube');
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
    const desc = req.body.desc;
    const ytUrl = req.body.ytUrl;
    const videoId = req.body.videoId;
    const belong = req.body.belong;
    const author = req.body.author;
    const color = req.body.color;
    const pbDate = req.body.pbDate;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;

    try {
        const response = await createWorship(title, originTitle, verse, speaker, desc, ytUrl, videoId, belong, author, color, pbDate, createdAt, updatedAt);

        console.log(response);
        console.log('WORSHIP CREATE SUCCESS!');
        res.json(response);
    } catch (error) {
        console.error(error);
    } 
});

/* get - Youtube Description */
router.post('/getWorshipDesc', async (req, res) => {
    console.log(req.body);
    const videoId = req.body.videoId;
    console.log(videoId);

    try {
        /* videoId로 youtube 동영상의 Desc(세부내용)을 얻습니다. */
        const data = await usetube.getVideoDesc(videoId);
        
        /* youtube 동영상의 desc(세부내용)에서 제목, 성경구절, 강사이름, desc을 추출합니다. */
        const response = processingText(data[0].text);
        console.log(data[0].text);

        /* 프론트엔드에 youtube 동영상의 desc에서 추출한 데이터(response)를 전달합니다. */
        res.json(response);

    } catch (error) {
        console.error(error);
    }
})

/* Youtbe 예배 영상 descirption을 텍스트 가공하는 메서드 */
const processingText = (text) => {
    let textArr = text.split(/\r\n|\r|\n/);
    
    const title = textArr.filter((elem) => {
        return (elem.includes('제목:'));
    });
    console.log(title.toString());
    
    const verse = textArr.filter((elem) => {
        return (elem.includes('본문:') || elem.includes('메시지:'));
    });
    console.log(verse.toString());

    const speaker = textArr.filter((elem) => {
        return (elem.includes('목사') || elem.includes('전도사'));
    });
    console.log(verse.toString());

    return {
        title: title.toString(),
        verse: verse.toString(),
        speaker: speaker.toString().trim(),
        desc: text,
    }
}

module.exports = router;