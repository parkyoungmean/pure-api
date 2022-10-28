const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json())

const { getBulletins } = require('../model/bulletins');

/* read - 주보 목록을 위한 메서드 */
router.get('/', async (req, res) => {
    const bulletins = await getBulletins();
    console.log('bulletins:', bulletins);

    res.json(bulletins);
});

module.exports = router;