const express = require('express');
const router = express.Router();
const app = express();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

app.use(express.json())

const { createMember, getMembers, getMembers_inl, getActiveMembers, getActiveMembers_inl, getBlockedMembers, activeMember, blockMember, findOne } = require('../model/members')


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

        if (member.length!==0) {

            if (member[0].Status==='blocked') {
                return res.json({
                    loginSuccess: false,
                    message: '차단된 회원입니다!',
                })
            }

            // member가 존재할 경우
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
    const { email, password, name, phoneNumber, avatar, role, bookmark, createdAt, updatedAt, Status } = req.body;

    try {
        const member = await findOne(email);

        console.log('회원의 정보:', member);
        console.log('회원정보의 길이:', member.length);
        
        if (member.length === 0) {                                          // member가 빈 배열일 경우 - 회원가입이 안되어있을 경우
        
            const hash = await bcrypt.hash(password, 12);
            const response = await createMember(email, hash, name, phoneNumber, avatar, role, bookmark, createdAt, updatedAt);

            console.log(response);
            console.log("MEMBER CREATE SUCCESS!");
            
            res.json({
                signupSuccess: true,
                message: '회원가입 성공!',
            })
        } else {
            if (member[0].Status==='blocked') {
                return res.json({
                    signupSuccess: false,
                    message: '차단된 회원입니다!',
                })
            } else {
                return res.json({
                    signupSuccess: false,
                    message: '이미 가입된 이메일입니다.'
                })
            }
        }

    } catch (error) {
        console.error(error);
    }
});

/* read - 회원 목록을 위한 메서드 */
router.get('/', async (req, res) => {
    const members = await getMembers();
    console.log('members:', members);

    res.json(members);
});

/* read infinite loading - 첫번째 회원 목록을 위한 메서드 */
router.get('/getMembers-inl', async (req, res) => {
    try {
        const members = await getMembers_inl();
        console.log('members:', members);

        res.json(members);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json(error.stack);
    }
});

/* read infinite loading - 회원 목록을 무한 로딩으로 계속 읽기 위한 메서드 */
router.post('/getMembers-inl', async (req, res) => {

    const { startCursor } = req.body;

    try {
        if (!startCursor) {
            const members = await getMembers_inl();
            console.log('members:', members);
        } else {
            const members = await getMembers_inl(startCursor);
            console.log('members:', members);
            res.json(members);
        }
    } catch (error) {
        console.error(error.stack);
        res.status(500).json(error.stack);
    }
    
});

/* read - 활성 회원 목록을 위한 메서드 */
router.get('/activeMembers', async (req, res) => {
    const members = await getActiveMembers();
    console.log('activeMembers:', members);

    res.json(members);
});

/* read - 첫번째 활성 회원 목록을 위한 메서드 */
router.get('/activeMembers-inl', async (req, res) => {
    try {
        const members = await getActiveMembers_inl();
        console.log('activeMembers:', members);
        res.json(members);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json(error.stack);
    }
});

/* read infinite loading - 활성 회원 목록을 무한 로딩으로 계속 읽기 위한 메서드 */
router.post('/activeMembers-inl', async (req, res) => {

    const { startCursor } = req.body;

    try {
        if (!startCursor) {
            const members = await getActiveMembers_inl();
            console.log('members:', members);
        } else {
            const members = await getActiveMembers_inl(startCursor);
            console.log('members:', members);
            res.json(members);
        }
    } catch (error) {
        console.error(error.stack);
        res.status(500).json(error.stack);
    }
    
});

/* read - 차단된 회원 목록을 위한 메서드 */
router.get('/blockedMembers', async (req, res) => {
    const members = await getBlockedMembers();
    console.log('blockMembers:', members);

    res.json(members);
});

/* active Member - 회원 회복을 위한 메서드 */
router.post('/activeMember', async (req, res) => {
    const id = req.body.id;

    try {
        const response = await activeMember(id);

        /* console.log(response); */
        console.log("MEMBER ACTIVE SUCCESS!");
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

/* block Member - 회원 차단을 위한 메서드 */
router.post('/blockMember', async (req, res) => {
    const id = req.body.id;

    try {
        const response = await blockMember(id);

        /* console.log(response); */
        console.log("MEMBER BLOCK SUCCESS!");
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;