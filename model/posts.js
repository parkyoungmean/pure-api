const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.POSTS_DATABASE_ID;

const getDatabase = async () => {
    const response = await notion.databases.retrieve({
        database_id: database_id,
    });
    console.log(response);
}

getDatabase();