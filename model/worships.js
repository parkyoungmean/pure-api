const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.WORSHIPS_DATABASE_ID;

const getDatabase = async () => {
    const response = await notion.databases.retrieve({
        database_id: database_id,
    });
    /* console.log(response); */
}

const createWorship = async (title, originTitle, verse, speaker, desc, ytUrl, videoId, belong, author, color, pbDate, createdAt, updatedAt) => {
    const response = await notion.pages.create({
        parent: { database_id: database_id },
        properties: {
            Title: {
                title: [
                {
                    text: {
                        content: title,
                    },
                },
                ],
            },
            OriginTitle: {
                rich_text: [
                {
                    text: {
                        content: originTitle,
                    },
                },
                ],
            },
            Verse: {
                rich_text: [
                {
                    text: {
                        content: verse,
                    },
                },
                ],
            },
            Speaker: {
                rich_text: [
                {
                    text: {
                        content: speaker,
                    },
                },
                ],
            },
            Desc: {
                rich_text: [
                {
                    text: {
                        content: desc,
                    },
                },
                ],
            },
            YtUrl: {
                rich_text: [
                {
                    text: {
                        content: ytUrl,
                    },
                },
                ],
            },
            VideoId: {
                rich_text: [
                {
                    text: {
                        content: videoId,
                    },
                },
                ],
            },
            Belong: {
                rich_text: [
                {
                    text: {
                        content: belong,
                    },
                },
                ],
            },
            Author: {
                rich_text: [
                {
                    text: {
                        content: author,
                    },
                },
                ],
            },
            Color: {
                rich_text: [
                {
                    text: {
                        content: color,
                    },
                },
                ],
            },
            PbDate: {
                date: {
                    start: pbDate,
                },
            },
            CreatedAt: {
                date: {
                    start: createdAt,
                },
            },
            UpdatedAt: {
                date: {
                    start: updatedAt,
                },
            },
            Status: {
                rich_text: [
                {
                    text: {
                    content: "created",
                    },
                },
                ],
            },
        },
    });

    return response;
}


module.exports = {
    createWorship,
}