const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json())

const { getNotices, getPrimaryNotices, createNotice } = require('../model/notices');

/* create - 공지사항 추가를 위한 메서드 */
router.post('/createNotice', async (req, res) => {
    console.log('여기는 공지사항 추가 라우터입니다.');

    const primary = req.body.primary;
    const title = req.body.title;
    const img = req.body.img;
    const content = req.body.content;
    const condition = req.body.condition;
    const belong = req.body.belong;
    const author = req.body.author;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;

    try {
        const response = await createNotice(primary, title, img, content, condition, belong, author, createdAt, updatedAt);

        console.log(response);
        console.log('CREATE SUCCESS NOTICE!');
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

/* read - 공지사항 리스트를 위한 메서드 */
router.get('/', async (req, res) => {
    const notices = await getNotices();
    console.log('notices:', notices);

    res.json(notices);
});

/* read - 메인(Primary) 공지사항 리스트를 위한 메서드 */
router.get('/getPrimaryNotices', async (req, res) => {
    const primaryNotices = await getPrimaryNotices();
    console.log('primaryNotices:', primaryNotices);

    res.json(primaryNotices);
});

module.exports = router;