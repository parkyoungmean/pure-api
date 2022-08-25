const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json())

const { getNotices } = require('../model/notices');


/* read - 공지사항 리스트를 위한 메서드 */
router.get('/', async (req, res) => {
    const notices = await getNotices();
    console.log('notices:', notices);

    res.json(notices);
});

module.exports = router;