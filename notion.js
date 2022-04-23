const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.NOTION_DATABASE_ID;

const getDatabase = async () => {
    const response = await notion.databases.retrieve({ database_id: database_id })
    console.log(response);
}

/* getDatabase(); */

const getVideo = async () => {
    const payload = {
        path: `databases/${database_id}/query`,
        method: `POST`
    }
    const { results } = await notion.request(payload)

    console.log(results);
}

getVideo();