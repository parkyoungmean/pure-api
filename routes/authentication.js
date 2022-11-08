const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json())


const admins = [
    {
        id: 0,
        name: '관리자',
        email: 'admin@admin.com',
        password: 'admin',
    },
    { 
        id: 1,
        name: 'root',
        email: 'root@admin.com',
        password: 'root',
    }
]

/* Login - 로그인을 위한 라우터 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    const admin = admins.find(admin => admin.email === email && admin.password === password);

    if (admin) {
        res.json(admin);
    } else {
        res.status(404);
    }
});

module.exports = router;