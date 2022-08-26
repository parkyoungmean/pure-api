const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.NOTICES_DATABASE_ID;


const getDatabase = async () => {
    const response = await notion.databases.retrieve({
        database_id: database_id,
    });
    console.log(response);
}

const getNotices = async () => {
    const payload = {
        path: `databases/${database_id}/query`,
        method: `POST`,
        body: {
            sorts: [
            {
                property: "CreatedAt",
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

    const notices = results.map((page) => {
        return {
            id: page.id,
            Title: page.properties.Title.title[0].text.content,
            Content: page.properties.Content.rich_text[0].text.content,
            Image: page.properties.Image.rich_text[0].text.content,
            Condition: page.properties.Condition.rich_text[0].text.content,
            Belong: page.properties.Belong.rich_text[0].text.content,
            Author: page.properties.Author.rich_text[0].text.content,
            CreatedAt: page.properties.CreatedAt.date.start,
            UpdatedAt: page.properties.UpdatedAt.date.start,
            Status: page.properties.Status.rich_text[0].text.content,
        };
    });

    return notices;
};

const createNotice = async (title, img, content, condition, belong, author, createdAt, updatedAt) => {
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
            Image: {
                rich_text: [
                {
                    text: {
                        content: img,
                    },
                },
                ],
            },
            Content: {
                rich_text: [
                {
                    text: {
                        content: content,
                    },
                },
                ],
            },
            Condition: {
                rich_text: [
                {
                    text: {
                        content: condition,
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
    createNotice,
    getNotices,
}