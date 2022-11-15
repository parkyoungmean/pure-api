require('dotenv').config();
const express = require('express');
const axios = require('axios');
const dayjs = require('dayjs');

const { getUsers, createUser, updateUser, deleteUser } = require('./model/users');
const { createWorship } = require('./model/worships')

const cors = require('cors');
const path = require("path");
const usetube = require('usetube');

const app = express();

const schoolRoute = require('./routes/school');                 // school 라우트를 추가
const noticeRoute = require('./routes/notice');                 // notice 라우트를 추가
const publicityRoute = require('./routes/publicity');           // publicity 라우트를 추가
const galleryRoute = require('./routes/gallery');               // gallery 라우트를 추가
const worshipRoute = require('./routes/worship');               // worship 라우트를 추가
const bulletinRoute = require('./routes/bulletin');             // bulletin 라우트를 추가
const authRoute = require('./routes/authentication');           // auth 라우트를 추가

app.use(cors());

//MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Import Router Middlewares
app.use('/school', schoolRoute);                  // school 라우트를 추가하고 기본 경로로 /school 사용
app.use('/notice', noticeRoute);                  // notice 라우트를 추가하고 기본 경로로 /notice 사용
app.use('/publicity', publicityRoute);            // publicity 라우트를 추가하고 기본 경로로 /publicity 사용
app.use('/gallery', galleryRoute);                // gallery 라우트를 추가하고 기본 경로로 /gallery 사용
app.use('/worship', worshipRoute);                // worship 라우트를 추가하고 기본 경로로 /worship 사용
app.use('/bulletin', bulletinRoute);              // bulletin 라우트를 추가하고 기본 경로로 /bulletin 사용
app.use('/auth', authRoute);                      // auth 라우트를 추가하고 기본 경로로 /auth 사용

const PORT = 4000;
const HOST = "localhost";

/* 
async function searchYtInfo() {
    const data = await usetube.searchChannel('순전한교회ThePureMinistry');

    console.log(data);
}

searchYtInfo(); 
 */

async function searchYtInfo01() {
    try {
        const arr = await usetube.getChannelVideos('UC9LuMbo8JtxglIrjRI_wU4A')

        /* console.log(arr); */


        /* 실행 */
        arr.forEach((v) => {
            const element = v;
            createAllWorship(element);
        })

    } catch (error) {
        console.error(error);
    }
}

/* 
searchYtInfo01(); 
 */

async function createAllWorship(element) {

    const title = element.title || '';
    const originTitle = element.original_title || '';
    const verse = element.verse || '';
    const speaker = element.speaker || '';
    let desc = element.desc || '';
    const ytUrl = `https://youtu.be/${element.id}`;
    const videoId = element.id;
    let belong = element.belong || '';
    const author = element.author || '';
    const color = element.color || '';
    const pbDate = element.publishedAt;
    const createdAt = element.publishedAt;
    const updatedAt = '1000-01-01T00:00:00.000';

    try {

        console.log('☆☆☆ 이 예배영상의 element.id는?:', element.id);
        console.log('☆☆☆ 이 예배영상의 videoId는?:', videoId);

        /* videoId로 youtube 동영상의 Desc(세부내용)을 얻습니다. */
        const data = await usetube.getVideoDesc(videoId);
        /* youtube 동영상의 desc(세부내용)에서 제목, 성경구절, 강사이름, desc을 추출합니다. */
        let response = processingText(data[0].text);

        originTitle.includes('주일') ? belong='주일예배' : originTitle.includes('주일예배') ? belong='주일예배' : response.desc.includes('주일설교') ? belong='주일예배' : originTitle.includes('Sunday') ? belong='주일예배' :  originTitle.includes('English') ? belong='주일예배' : originTitle.includes('연합예배') ? belong='주일예배' : originTitle.includes('목요예배') ? belong='목요예배' : originTitle.includes('목요특별') ? belong='목요예배' : originTitle.includes('어린이예배') ? belong='어린이예배' : originTitle.includes('프랜드') ? belong='어린이예배': originTitle.includes('청소년주일예배') ? belong='청소년예배' : originTitle.includes('청소년부 예배') ? belong='청소년예배' : originTitle.includes('청소년부예배') ? belong='청소년예배' : originTitle.includes('청소년 예배') ? belong='청소년예배' :originTitle.includes('청년부') ? belong='청년부예배' :  originTitle.includes('청년부예배') ? belong='청년부예배' : originTitle.includes('송구영신') ? belong='송구영신예배' : originTitle.includes('성탄예배') ? belong='성탄예배' : originTitle.includes('러브레터') ? belong='특별행사' : originTitle.includes('부활절') ? belong='주일예배' : originTitle.includes('큐티묵상') ? belong='큐티묵상' : originTitle.includes('큐티 묵상') ? belong='큐티묵상' : originTitle.includes('찬양묵상') ? belong='찬양묵상' : response.desc.includes('간증') ? belong='간증' : originTitle.includes('복음학교') ? belong='복음학교' : originTitle.includes('Gospel') ? belong='복음학교' : originTitle.includes('치유학교') ? belong='치유학교' : belong='';

        let worship = {
            originTitle: originTitle,
            title: response.title,
            verse: response.verse,
            speaker: response.speaker,
            desc: response.desc,
            ytUrl: ytUrl,
            videoId: videoId,
            belong: belong,
            author: '관리자',
            color: selectColorToBelong(belong),
            pbDate: pbDate,
            createdAt: createdAt,
            pbDate: pbDate,
            updatedAt: updatedAt,
        }
        if (worship.desc==='설명') {
            
        } else {
            if (worship.desc.includes('간증')) {
                worship = processTestimony(worship);
            } 
            else if(worship.belong.includes('목요예배') && !worship.belong.includes('어린이예배')) {
                worship = processThursday(worship);
            } 
            else if(worship.belong.includes('주일예배')) {
                worship = processSunday(worship);
            }
            else if(worship.belong.includes('어린이예배')) {
                worship = processChildren(worship);
            } 
            else if(worship.belong.includes('큐티묵상')) {
                worship = processQt(worship);
            }
            else if(worship.belong.includes('찬양묵상')) {
                worship = processGospel(worship);
            }
        }
        
        

         const res = await createWorship(worship.title, worship.originTitle, worship.verse, worship.speaker, worship.desc, worship.ytUrl, worship.videoId, worship.belong, worship.author, worship.color, dayjs(worship.pbDate).add(9, "hour"), dayjs(worship.createdAt).add(9, "hour"), worship.updatedAt);

        console.log(res);
        /* console.log('WORSHIP CREATE SUCCESS!'); */
       

        console.log(worship);
        
    } catch (error) {
        console.error(error);
    } 
}


/* 예배의 소속(Belong)을 검사하여 색상을 선택하는 메서드 */
const selectColorToBelong = (belong) => {
    
    switch (belong) {
        case '주일예배':
            // 변수가 값1이면 실행할 로직
            color = 'bg-carnation-pink-400'
            break;
        case '목요예배':
            // 변수가 값2이면 실행할 로직
            color = 'bg-[#95E1D3]'
            break;
        case '어린이예배':
            // 변수가 값3이면 실행할 로직
            color = 'bg-[#F9D423]'
            break;
        case '청소년예배':
            // 변수가 값4이면 실행할 로직
            color = 'bg-[#EAFFD0]'
            break;
        case '청년부예배':
            // 변수가 값5이면 실행할 로직
            color = 'bg-[#8522E1]'
            break;
        case '성탄예배':
            // 변수가 값6이면 실행할 로직
            color = 'bg-[#8522E1]'
            break;
        case '송구영신예배':
            // 변수가 값7이면 실행할 로직
            color = 'bg-[#CA4DC2]'
            break;
        case '특별행사':
            // 변수가 값8이면 실행할 로직
            color = 'bg-[#8522E1]'
            break;
        case '간증':
            // 변수가 값9이면 실행할 로직
            color = 'bg-purple-200'
            break;
        case '큐티묵상':
            // 변수가 값10이면 실행할 로직
            color = 'bg-purple-200'
            break;
        case '찬양묵상':
            // 변수가 값11이면 실행할 로직
            color = 'bg-purple-200'
            break;
        case '중보기도학교':
            // 변수가 값12이면 실행할 로직
            color = 'bg-fuchsia-200'
            break;
        case '치유학교':
            // 변수가 값13이면 실행할 로직
            color = 'bg-orange-200'
            break;
        case '복음학교':
            // 변수가 값14이면 실행할 로직
            color = 'bg-amber-300'
            break;
        case '사역자학교':
            // 변수가 값15이면 실행할 로직
            color = 'bg-blue-200'
            break;
        case '친밀감학교':
            // 변수가 값16이면 실행할 로직
            color = 'bg-rose-200'
            break;
        default:
            color = 'bg-[#9F09FF]'
            // 변수가 위 어떤 케이스에도 해당하지 않는 경우 실행할 로직
    }
    return color;
}

/* Youtbe 예배 영상 descirption을 텍스트 가공하는 메서드 */
const processingText = (text) => {
    let textArr = text.split(/\r\n|\r|\n/);
    /* let textArr = text.split("\\n"); */
    
    let title = textArr.filter((elem) => {
        return (elem.includes('제목:'));
    });
    
    let verse = textArr.filter((elem) => {
        return (elem.includes('본문:') || elem.includes('메시지:') || elem.includes('말씀:'));
    });

    let speaker = textArr.filter((elem) => {
        return (elem.includes('목사') || elem.includes('전도사') || elem.includes('선교사'));
    });

     /* 제목 가공 */
    if (title==='') {
                
    } else if (title.includes('제목:')) {
        title = title.replace("- 제목:","").trim();
    }

     /* 성경구절 가공*/
     if (verse==='') {
                
    } if (verse.includes('본문:')) {
        verse = verse.replace("본문:","").trim();
    } else if (verse.includes('메시지:')) {
        verse = verse.replace("메시지:","").trim();
    } else if (verse.includes('말씀:')) {
        verse = verse.replace("말씀:","").trim();
    }

    /* 강사 가공 */
    if (speaker==='') {

    } else if (speaker.includes('말씀:')) {
        speaker = speaker.replace('말씀:','');
    }

    return {
        title: title.toString(),
        verse: verse.toString(),
        speaker: speaker.toString().trim(),
        desc: text,
    }
}

/* 간증일 경우 */
const processTestimony = (worship) => { 
    
    /* 간증 - 0:제목, 1:강사 */
    let titleArr = worship.originTitle.split(/[/]/);

    if (titleArr.length!==0) {
        if(worship.title==='') worship.title = titleArr[0]!=='' ? titleArr[0] : titleArr[0];
        if(worship.speaker==='') worship.speaker = titleArr[1]!=='' ? titleArr[1] : titleArr[1];
        worship.pbDate = worship.desc.replace(/\s/gi, '').substr(0, 10);
    }

    return worship;
}

/* 목요예배 일 경우 */
const processThursday = (worship) => { 
    
    /* 목요 - 0:근원 , 1:날짜, 2:구절, 3:강사 */
    let titleArr = worship.originTitle.split(/[/]/);

    if (titleArr.length!==0) {
        if(worship.title==='') worship.title = titleArr[0];
        /* worship.pbDate = titleArr[1].trim(); */
        if(worship.verse==='') worship.verse = titleArr[2];
        if(worship.speaker==='') worship.speaker = titleArr[3];
    }

    if (worship.title=== undefined) {
        worship.title = ''
    } else if (worship.verse=== undefined) {
        worship.verse = ''
    } else if (worship.speaker=== undefined) {
        worship.speaker = ''
    }

    return worship;
}

/* 어린이 예배 일 경우 - originTitle 사용 */
const processChildren = (worship) => { 
    
    /* 목요 - 0:근원 , 1:날짜, 2:구절, 3:강사 */
    let titleArr = worship.originTitle.split(/[/]/);

    if (titleArr.length!==0) {
        if(worship.title==='') worship.title = titleArr[0]!=='' ? titleArr[0] : titleArr[0];
        /* worship.pbDate = titleArr[1].trim(); */
        if(worship.verse==='') worship.verse = titleArr[2]!=='' ? titleArr[2] : titleArr[2];
        if(worship.speaker==='') worship.speaker = titleArr[3];
    }

    if (worship.title=== undefined) {
        worship.title = ''
    } else if (worship.verse=== undefined) {
        worship.verse = ''
    } else if (worship.speaker=== undefined) {
        worship.speaker = ''
    }

    return worship;
}

/* 큐티묵상 일 경우 - desc 사용 */
const processQt = (worship) => { 
    
    
    let titleArr = worship.desc.split("\\n");

    if (titleArr.length > 1) {
        /* 큐티 - 0:제목 , 1:강사, 2:구절 */
        if(worship.title==='') worship.title = titleArr[0]!=='' ? titleArr[0] : titleArr[0];
        /* worship.pbDate = titleArr[1].trim(); */
        if(worship.speaker==='') worship.speaker =  titleArr[1]!=='' ? titleArr[1] : titleArr[1];
        if(worship.verse==='') worship.verse = titleArr[2]!=='' ? titleArr[2] : titleArr[2];
    } else if (titleArr.length ===1) {
        /* 큐티 - 0:구절*/
        /* 제목만 있는 경우이므로 verse,speak는 ''을 부여합니다. */
        if(worship.verse==='') worship.verse = titleArr[0]!=='' ? titleArr[0] : titleArr[0];
        worship.speaker='';
    }

    if (worship.title=== undefined) {
        worship.title = ''
    } else if (worship.verse=== undefined) {
        worship.verse = ''
    } else if (worship.speaker=== undefined) {
        worship.speaker = ''
    }

    return worship;
}

/* 찬양묵상 일 경우 - desc 사용 */
const processGospel = (worship) => { 
    
    
    let titleArr = worship.desc.split("\\n");

    if (titleArr.length > 1) {
        /* 큐티 - 0:제목 , 1:강사, 2:찬양곡 */
        if(worship.title==='') worship.title = titleArr[0]!=='' ? titleArr[0] : titleArr[0];
        /* worship.pbDate = titleArr[1].trim(); */
        if(worship.speaker==='') worship.speaker =  titleArr[1]!=='' ? titleArr[1] : titleArr[1];
        if(worship.verse==='') worship.verse = titleArr[2]!=='' ? titleArr[2] : titleArr[2];

    } else if (titleArr.length ===1) {
        /* 큐티 - 0:구절*/
        /* 제목만 있는 경우이므로 verse,speak는 ''을 부여합니다. */
        if(worship.verse==='') worship.verse = titleArr[0]!=='' ? titleArr[0] : titleArr[0];
        worship.speaker='';
    }

    if (worship.title=== undefined) {
        worship.title = ''
    } else if (worship.verse=== undefined) {
        worship.verse = ''
    } else if (worship.speaker=== undefined) {
        worship.speaker = ''
    }

    return worship;
}



/* 주일예배 일 경우 - originTitle 사용 */
const processSunday = (worship) => { 
    
    
    let titleArr = worship.originTitle.split(/[/]/);

    if (titleArr.length > 3) {
        /* 주일 - 0:제목, 1:구절, 2:강사, 3:날짜  */
        if(worship.title==='') worship.title = titleArr[0]!=='' ? titleArr[0] : titleArr[0];
        if(worship.verse==='') worship.verse = titleArr[1]!=='' ? titleArr[1] : titleArr[1];
        if(worship.speaker==='') worship.speaker = titleArr[2]!=='' ? titleArr[2] : titleArr[2];
        /* worship.pbDate = titleArr[3].trim(); */
    } else if (titleArr.length === 3) {
        /* 주일 - 0:구절, 1:제목, 2:강사  */
        if(worship.verse==='') worship.verse = titleArr[0]!=='' ? titleArr[0] : titleArr[0];
        if(worship.title==='') worship.title = titleArr[1]!=='' ? titleArr[1] : titleArr[1];
        if(worship.speaker==='') worship.speaker = titleArr[2]!=='' ? titleArr[2] : titleArr[2];
    } else if (titleArr.length === 1) {
        console.log('☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆', titleArr);
        console.log(worship.originTitle);
        worship.pbDate = worship.originTitle.replace(/\s/gi, '').substr(0, 10);
    }

    if (worship.title=== undefined) {
        worship.title = ''
    } else if (worship.verse=== undefined) {
        worship.verse = ''
    } else if (worship.speaker=== undefined) {
        worship.speaker = ''
    }
    
    return worship;
}

/* const loadVideo = async (iframe) => {

    const pid = 'UU9LuMbo8JtxglIrjRI_wU4A';
                
    const playlistURL = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?playlist_id=${pid}`)
    const reqURL = `https://api.rss2json.com/v1/api.json?rss_url=${playlistURL}`;

    
    const res = await axios.get(
        reqURL
      );
      console.log(res.data);
  
}

loadVideo();
 */
/* 
async function searchYtInfo() {
    const data = await usetube.getVideoDesc('SOjT9l7hmxg');

    console.log(data);
}

searchYtInfo(); 
*/



/*
async function searchYtInfo3() {
    const data = await usetube.getVideosFromDesc('SOjT9l7hmxg');

    console.log(data);
} 
*/

/* searchYtInfo3(); */

async function searchYtInfo02() {
    /* const data = await usetube.getVideoDesc('kIO4DObBXoU'); */
    /* const data = await usetube.getPlaylistVideos('PL13DkA-MmUMtDgdl9Gz_lU5iJ5lWPBEM-'); */
    /* const data = await usetube.getPlaylistVideos('PL13DkA-MmUMucJ-IKlGndvVmnN9wYKl7_'); */
    /* const data = await usetube.getPlaylistVideos('PL13DkA-MmUMsnKR6z_yJlhPYtHlgWG1uF', 0); */
    /* const data = await usetube.getPlaylistVideos('PL13DkA-MmUMt1JP_r1sH_lnrZ0JpZl8GF', 0); */

    /* console.log(data); */
}

/* searchYtInfo02(); */

// GET request
app.get('/users', async (req, res) => {
    const users = await getUsers();
    res.json(users);
})

// POST request
/* Create User */
app.post('/createUser', async (req, res) => {
    // req.body
    /* {
        email: "example@exam.com"
        name: "peter",
        phoneNumber: "000-0000-0000",
        extraInfo: "this is Infomation",
    } */
    const name = req.body.name;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const img = req.body.img;
    const greetings = req.body.greetings;
    const extraInfo = req.body.extraInfo;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;
    const bookmark = req.body.bookmark;
    
    try {
        const response = await createUser(name, email, phoneNumber, img, greetings, extraInfo, createdAt, updatedAt, bookmark);
        
        console.log(response);
        console.log("CREATE SUCCESS!");
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

/* Update User */
app.post('/updateUser', async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const img = req.body.img;
    const greetings = req.body.greetings;
    const extraInfo = req.body.extraInfo;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt;
    const bookmark = req.body.bookmark;
    
    try {
        const response = await updateUser(id, name, email, phoneNumber, img, greetings, extraInfo, createdAt, updatedAt, bookmark);
        
        console.log(response);
        console.log("UPDATE SUCCESS!");
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});

/* Delete User */
app.post('/deleteUser', async (req, res) => {
    const id = req.body.id;

    try {
        const response = await deleteUser(id);

        console.log(response);
        console.log("DELETE SUCCESS!");
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});


app.listen(process.env.PORT, () => {
    console.log("Starting proxy at " + HOST + ":" + process.env.PORT);
})




