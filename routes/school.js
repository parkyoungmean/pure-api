const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json())

const { getSchools, createSchool, updateSchool, deleteSchool } = require('../model/schools');

router.get('/', async (req, res) => {
    const schools = await getSchools();
    /* console.log('schools:', schools); */
    res.json(schools);
});


/* 학교 오리진 추가를 위한 메서드 */
router.post('/createSchool', async (req, res) => {
    console.log('여기는 학교 등록 라우터입니다.');
    console.log(req.body);

    const name = req.body.name;
    const subtitle = req.body.subtitle;
    const img = req.body.img;
    const description = req.body.description;
    const curriculum = JSON.stringify(req.body.curriculum);
    const registration = req.body.registration;
    const graduate = req.body.graduate;
    const color = JSON.stringify(req.body.color);
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;
    const bookmark = req.body.bookmark;
    
    try {
        const response = await createSchool(name, subtitle, img, description, curriculum, registration, graduate, color, createdAt, updatedAt, bookmark);

        /* console.log(response); */
        console.log('CREATE SUCCESS SCHOOL!');
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

/* Update School */
router.post('/updateSchool', async (req, res) => {
    console.log('여기는 학교정보 수정 라우터입니다.');
    /* console.log(req.body); */

    const id = req.body.id;
    const name = req.body.name;
    const subtitle = req.body.subtitle;
    const img = req.body.img;
    const description = req.body.description;
    const curriculum = JSON.stringify(req.body.curriculum);
    const registration = req.body.registration;
    const graduate = req.body.graduate;
    const color = JSON.stringify(req.body.color);
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;
    const bookmark = req.body.bookmark;
    
    try {
        const response = await updateSchool(id, name, subtitle, img, description, curriculum, registration, graduate, color, createdAt, updatedAt, bookmark);

        /* console.log(response); */
        console.log('UPDATE SUCCESS SCHOOL!');
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

/* Delete School */
router.post('/deleteSchool', async (req, res) => {
    const id = req.body.id;

    try {
        const response = await deleteSchool(id);

        /* console.log(response); */
        console.log("SCHOOL DELETE SUCCESS!");
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});


module.exports = router;
