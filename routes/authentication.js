const express = require('express');
const router = express.Router();
const app = express();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

app.use(express.json())

const { createMember, findOne } = require('../model/members')


/* account - 인증을 위한 라우터 */
router.post('/account', async (req, res) => {
    if (req.body.token) {
        jwt.verify(req.body.token, process.env.JWT_SECRET, (err, decoded) => {
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
    const { email, password, autoLogin } = req.body;

    try {
        const member = await findOne(email);

        if (member.length!==0) {                                        // member가 존재할 경우
            const result = await bcrypt.compare(password, member[0].Password);
            console.log(result);

            if (!result) {
                return res.json({
                    loginSuccess: false,
                    message: '비밀번호가 일치하지 않습니다.'
                })
            }

            let expiresIn = "30m";

            if (autoLogin) {
                expiresIn = "30d";
            }

            console.log('autoLogin:', true);
            console.log('expiresIn:', expiresIn);

            const token = jwt.sign({
                email: member[0].Email,
                name: member[0].Name,
                role: member[0].Role,
                createdAt: member[0].createdAt,
            }, process.env.JWT_SECRET, {
                expiresIn: expiresIn,
                issuer: "purechurch",
            });
            
            res.json({
                loginSuccess: true,
                message: '로그인 성공!',
                token: token,
                data: { email: member[0].Email, name: member[0].Name, role: member[0].Role, createdAt: member[0].CreatedAt },
            })

        } else {                                                            // member가 존재하지 않을 경우
            return res.json({
                loginSuccess: false,
                message: '가입되지 않은 회원입니다.'
            })
        }
    } catch (error) {
        res.status(404).json;
    }
});

/* Signup - 회원가입을 위한 라우터 */
router.post('/signup', async (req, res) => {
    const { email, password, name, phoneNumber, avatar, role, bookmark, createdAt, updatedAt } = req.body;

    try {
        const member = await findOne(email);

        if (member.length === 0) {                                          // member가 빈 배열일 경우
            
            const hash = await bcrypt.hash(password, 12);
            const response = await createMember(email, hash, name, phoneNumber, avatar, role, bookmark, createdAt, updatedAt);

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