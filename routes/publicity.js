const express = require('express');
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

    const img = req.body.img;
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

    try {
        const response = await createPublicity(img, title, subtitle, content, condition, belong, author, size, color, createdAt, updatedAt);

        console.log(response);
        console.log('CREATE SUCCESS PUBLICITY!');
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
