const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.IMAGES_DATABASE_ID;

const getDatabase = async () => {
    const response = await notion.databases.retrieve({
        database_id: database_id,
    });
    /* console.log(response); */
}

const getGallery = async () => {
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
                and: [
                    { property: "Status", rich_text: { does_not_contain: "deleted" } },
                    { property: "Category", rich_text: { contains: "gallery" } },
                ],
            },
        },
    };
    const { results } = await notion.request(payload);

    const gallery = results.map((page) => {
        return {
            id: page.id,
            Title: page.properties.Title.title[0].text.content,
            Img01: page.properties.Img01.rich_text[0].text.content,
            Img02: page.properties.Img02.rich_text[0].text.content,
            Category: page.properties.Category.rich_text[0].text.content,
            Belong: page.properties.Belong.rich_text[0].text.content,
            Author: page.properties.Author.rich_text[0].text.content,
            CreatedAt: page.properties.CreatedAt.date.start,
            UpdatedAt: page.properties.UpdatedAt.date.start,
            Status: page.properties.Status.rich_text[0].text.content,
        };
    });

    return gallery;
};

const createGallery = async (title, imgs01, imgs02, category, belong, author, createdAt, updatedAt) => {
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
            Img01: {
                rich_text: [
                {
                    text: {
                        content: imgs01,
                    },
                },
                ],
            },
            Img02: {
                rich_text: [
                {
                    text: {
                        content: imgs02,
                    },
                },
                ],
            },
            Category: {
                rich_text: [
                {
                    text: {
                        content: category,
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

const updateGallery = async (id, title, imgs01, imgs02, category, belong, author, createdAt, updatedAt) => {
    const response = await notion.pages.update({
        parent: { database_id: database_id },
        page_id: id,
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
            Img01: {
                rich_text: [
                {
                    text: {
                        content: imgs01,
                    },
                },
                ],
            },
            Img02: {
                rich_text: [
                {
                    text: {
                        content: imgs02,
                    },
                },
                ],
            },
            Category: {
                rich_text: [
                {
                    text: {
                        content: category,
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
                    content: "updated",
                    },
                },
                ],
            },
        },
    });

    return response;
}

const deleteGallery = async (id) => {
    const response = await notion.pages.update({
        page_id: id,
        properties: {
            Status: {
                rich_text: [
                    {
                        text: {
                            content: "deleted",
                        },
                    },
                ],
            },
        },
    });
    return response;   
}

module.exports = {
    createGallery,
    getGallery,
    updateGallery,
    deleteGallery,
}