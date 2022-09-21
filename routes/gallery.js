const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json())

const { getGallery, createGallery, updateGallery, deleteGallery } = require('../model/gallery');

/* create - 갤러리 추가를 위한 메서드 */
router.post('/createGallery', async (req, res) => {
    console.log('여기는 갤러리 추가 라우터입니다.');

    const title = req.body.title;
    const imgs01 = req.body.imgs01;
    const imgs02 = req.body.imgs02;
    const category = req.body.category;
    const belong = req.body.belong;
    const author = req.body.author;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;

    try {
        const response = await createGallery(title, imgs01, imgs02, category, belong, author, createdAt, updatedAt);

        console.log(response);
        console.log('GALLERY CREATE SUCCESS!');
        res.json(response);
    } catch (error) {
        console.error(error);
    }
    
});

/* read - 갤러리 목록을 위한 메서드 */
router.get('/', async (req, res) => {
    const gallery = await getGallery();
    console.log('gallery:', gallery);

    res.json(gallery);
});

/* update - 갤러리 수정을 위한 메서드 */
router.post('/updateGallery', async (req, res) => {
    console.log('여기는 갤러리 수정 라우터입니다.');

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
        const response = await updateGallery(id, title, imgs01, imgs02, category, belong, author, createdAt, updatedAt);

        console.log(response);
        console.log('GALLERY UPDATE SUCCESS!');
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

/* delete Gallery - 갤러리 삭제를 위한 메서드 */
router.post('/deleteGallery', async (req, res) => {
    const id = req.body.id;

    try {
        const response = await deleteGallery(id);

        console.log(response);
        console.log("GALLERY DELETE SUCCESS!");
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
