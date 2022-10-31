const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json())

const { getBulletins, createBulletin } = require('../model/bulletins');

/* create - 주보 추가를 위한 메서드 */
router.post('/createBulletin', async (req, res) => {
    console.log('여기는 주보 추가 라우터입니다.');

    console.log(req.body);
    
    const title = req.body.title;
    const imgs01 = req.body.imgs01;
    const imgs02 = req.body.imgs02;
    const category = req.body.category;
    const belong = req.body.belong;
    const author = req.body.author;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;

    try {
        const response = await createBulletin(title, imgs01, imgs02, category, belong, author, createdAt, updatedAt);

        console.log(response);
        console.log('BULLETIN CREATE SUCCESS!');
        res.json(response);
    } catch (error) {
        console.error(error);
    }
    
});

/* read - 주보 목록을 위한 메서드 */
router.get('/', async (req, res) => {
    const bulletins = await getBulletins();
    console.log('bulletins:', bulletins);

    res.json(bulletins);
});

module.exports = router;