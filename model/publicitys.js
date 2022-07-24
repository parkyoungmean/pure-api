const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.NOTICES_DATABASE_ID;


const getDatabase = async () => {
    const response = await notion.databases.retrieve({
        database_id: database_id,
    });
    console.log(response);
}

/* getDatabase(); */

const createPublicity = async (img, title, subtitle, content, condition, belong, author, size, color, createdAt, updatedAt) => {
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
            Img: {
                rich_text: [
                {
                    text: {
                        content: img,
                    },
                },
                ],
            },
            Subtitle: {
                rich_text: [
                {
                    text: {
                        content: subtitle,
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
            Size: {
                rich_text: [
                {
                    text: {
                        content: size,
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
    createPublicity,
}