const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json())

const { getGallery } = require('../model/gallery');

/* read - 갤러리 목록을 위한 메서드 */
router.get('/', async (req, res) => {
    const gallery = await getGallery();
    console.log('gallery:', gallery);

    res.json(gallery);
});

module.exports = router;
