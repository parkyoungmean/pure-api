const express = require('express');
const router = express.Router();
const app = express();
const jwt = require('jsonwebtoken')

app.use(express.json())

const { createMember, findOne } = require('../model/members')


/* account - 인증을 위한 라우터 */
router.post('/account', async (req, res) => {
    console.log('26번줄 token:', req.body);

    if (req.body.token) {
        jwt.verify(req.body.token, "abc1234567", (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {     // 유효기간 초과
                    return res.status(419).json({
                        code: 419,
                        message: '토큰이 만료되었습니다',
                    });
                }
                return res.status(401).json({
                    code: 401,
                    message: '유효하지 않은 토큰입니다',
                });
            } else {
                res.json(decoded);
            }
        })
    } else {
        res.status(404).json();
    }
});

/* Login - 로그인을 위한 라우터 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    const admin = admins.find(admin => admin.email === email && admin.password === password);

    if (admin) {

        const token = jwt.sign({
            email: admin.email,
            name: admin.name,
        }, "abc1234567", {
            expiresIn: "15m",
            issuer: "purechurch",
        });

        res.json({
            token: token, 
            email: admin.email, 
            name: admin.name
        });

    } else {
        res.status(404).json;
    }
});

/* Signup - 회원가입을 위한 라우터 */
router.post('/signup', async (req, res) => {
    const { email, password, name, phoneNumber, avatar, role, bookmark, createdAt, updatedAt } = req.body;

    try {
        const member = await findOne(email);

        if (member.length === 0 ) {
            const response = await createMember(email, password, name, phoneNumber, avatar, role, bookmark, createdAt, updatedAt);

            console.log(response);
            console.log("MEMBER CREATE SUCCESS!");
            
            res.json({
                signupSuccess: true,
                message: '회원가입 성공!',
            })
        } else {
            return res.json({
                signupSuccess: false,
                message: '이미 가입된 이메일입니다.'
            })
        }

    } catch (error) {
        console.error(error);
    }
});

module.exports = router;