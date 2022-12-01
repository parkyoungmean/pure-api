const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json())

const { getBulletins, getBulletins_inl, createBulletin, updateBulletin, deleteBulletin } = require('../model/bulletins');

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
    console.log('bulletins:', req.body);
    const bulletins = await getBulletins();
    console.log('bulletins:', bulletins);

    res.json(bulletins);
});

/* read infinite loading - 첫번째 주보 목록을 위한 메서드 */
router.get('/getBulletins-inl', async (req, res) => {
    try {
        const bulletins = await getBulletins_inl();
        console.log('bulletins:', bulletins);

        res.json(bulletins);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json(error.stack);
    }
});

/* read infinite loading - 주보 목록을 무한 로딩으로 계속 읽기 위한 메서드 */
router.post('/getBulletins-inl', async (req, res) => {

    const { startCursor } = req.body;

    try {
        if (!startCursor) {
            const bulletins = await getBulletins_inl();
            console.log('bulletins:', bulletins);
        } else {
            const bulletins = await getBulletins_inl(startCursor);
            console.log('bulletins:', bulletins);
            res.json(bulletins);
        }
    } catch (error) {
        console.error(error.stack);
        res.status(500).json(error.stack);
    }
    
});

/* update - 주보 수정을 위한 메서드 */
router.post('/updateBulletin', async (req, res) => {
    console.log('여기는 주보 수정 라우터입니다.');

    const id = req.body.id;
    const title = req.body.title;
    const imgs01 = req.body.imgs01;
    const imgs02 = req.body.imgs02;
    const category = req.body.category;
    const belong = req.body.belong;
    const author = req.body.author;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;

    try {
        const response = await updateBulletin(id, title, imgs01, imgs02, category, belong, author, createdAt, updatedAt);

        console.log(response);
        console.log('BULLETIN UPDATE SUCCESS!');
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

/* delete Bulletin - 주보 삭제를 위한 메서드 */
router.post('/deleteBulletin', async (req, res) => {
    const id = req.body.id;

    try {
        const response = await deleteBulletin(id);

        /* console.log(response); */
        console.log("BULLETIN DELETE SUCCESS!");
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;