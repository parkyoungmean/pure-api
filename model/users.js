const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.STUDENTS_DATABASE_ID;

const getDatabase = async () => {
  const response = await notion.databases.retrieve({
    database_id: database_id,
  });
  console.log(response);
};

/* getDatabase(); */

const getUsers = async () => {
  const payload = {
    path: `databases/${database_id}/query`,
    method: `POST`,
    body: {
      "sorts": [
          {
              "property": "CreatedAt",
              "direction": "ascending"
          }
      ]
    },
  };
  const { results } = await notion.request(payload);

  const users = results.map((page) => {
    return {
      id: page.id,
      Name: page.properties.Name.title[0].text.content,
      Phone_Number: page.properties.Phone_Number.rich_text[0].text.content,
      Img: page.properties.Img.rich_text[0].text.content,
      Greetings: page.properties.Greetings.rich_text[0].text.content,
      Extra_Information: page.properties.Extra_Information.rich_text[0].text.content,
      CreatedAt: page.properties.CreatedAt.date.start,
      Img: page.properties.Img.rich_text[0].text.content,
      Bookmark: page.properties.Img.rich_text[0].text.content,
    };
  });

  return users;
};

const createUser = async (name, phoneNumber, extraInfo) => {

  const response = await notion.pages.create({
    parent: { database_id: database_id },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
      Phone_Number: {
        rich_text: [
          {
            text: {
              content: phoneNumber,
            },
          },
        ],
      },
      Extra_Information: {
        rich_text: [
          {
            text: {
              content: extraInfo,
            },
          },
        ],
      },
    },
  });

  return response;
};

module.exports = {
  getUsers,
  createUser,
};
