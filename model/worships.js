const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.WORSHIPS_DATABASE_ID;

const getDatabase = async () => {
    const response = await notion.databases.retrieve({
        database_id: database_id,
    });
    console.log(response);
}

/* getDatabase(); */

const getWorships = async () => {
    const payload = {
        path: `databases/${database_id}/query`,
        method: `POST`,
        body: {
            sorts: [
                {
                    property: "PbDate",
                    direction: "descending",
                },
            ],
            filter: {
                or: [
                    { property: "Status", rich_text: { does_not_contain: "deleted" } },
                ],
            },
        },
    };
    const { results } = await notion.request(payload);

    const worships = results.map((page) => {
        return {
            id: page.id,
            Title: page.properties.Title.title[0].text.content,
            OriginTitle: page.properties.OriginTitle.rich_text[0].text.content,
            Verse: page.properties.Verse.rich_text[0].text.content,
            Speaker: page.properties.Speaker.rich_text[0].text.content,
            Desc: page.properties.Desc.rich_text[0].text.content,
            YtUrl: page.properties.YtUrl.rich_text[0].text.content,
            VideoId: page.properties.VideoId.rich_text[0].text.content,
            Belong: page.properties.Belong.rich_text[0].text.content,
            Author: page.properties.Author.rich_text[0].text.content,
            Color: page.properties.Color.rich_text[0].text.content,
            PbDate: page.properties.PbDate.date.start,
            CreatedAt: page.properties.CreatedAt.date.start,
            UpdatedAt: page.properties.UpdatedAt.date.start,
            Status: page.properties.Status.rich_text[0].text.content,
        };
    });

    return worships;
};

/* 무한 스크롤링(Infinite Scrolling) */
const getWorships_ins = async (startCursor) => {

    const payload = await notion.databases.query({
        database_id: database_id,
        sorts: [
            {
                property: "PbDate",
                direction: "descending",
            },
        ],
        filter: {
            or: [
                { property: "Status", rich_text: {does_not_contain: "deleted" }},
            ]
        },
        start_cursor: startCursor,
        page_size: 20,
    })

    const worships = payload.results.map((page) => {
        return {
            id: page.id,
            Title: page.properties.Title.title[0].text.content,
            OriginTitle: page.properties.OriginTitle.rich_text[0].text.content,
            Verse: page.properties.Verse.rich_text[0].text.content,
            Speaker: page.properties.Speaker.rich_text[0].text.content,
            Desc: page.properties.Desc.rich_text[0].text.content,
            YtUrl: page.properties.YtUrl.rich_text[0].text.content,
            VideoId: page.properties.VideoId.rich_text[0].text.content,
            Belong: page.properties.Belong.rich_text[0].text.content,
            Author: page.properties.Author.rich_text[0].text.content,
            Color: page.properties.Color.rich_text[0].text.content,
            PbDate: page.properties.PbDate.date.start,
            CreatedAt: page.properties.CreatedAt.date.start,
            UpdatedAt: page.properties.UpdatedAt.date.start,
            Status: page.properties.Status.rich_text[0].text.content,
        };
    });

    return [payload.next_cursor, payload.has_more, worships];

};

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
    getWorships,
    getWorships_ins,
}