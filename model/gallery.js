const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.IMAGES_DATABASE_ID;

const getDatabase = async () => {
    const response = await notion.databases.retrieve({
        database_id: database_id,
    });
    console.log(response);
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
            or: [
                { property: "Status", rich_text: { does_not_contain: "deleted" } },
            ],
            },
        },
    };
    const { results } = await notion.request(payload);

    const gallery = results.map((page) => {
        return {
            id: page.id,
            Title: page.properties.Title.title[0].text.content,
            Img: page.properties.Img.rich_text[0].text.content,
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

module.exports = {
    getGallery,
}