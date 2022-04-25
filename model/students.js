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

const getStudents = async () => {
  const payload = {
    path: `databases/${database_id}/query`,
    method: `POST`,
  };
  const { results } = await notion.request(payload);

  const students = results.map((page) => {
    return {
      id: page.id,
      Name: page.properties.Name.title[0].text.content,
      Phone_Number: page.properties.Phone_Number.rich_text[0].text.content,
      Extra_Information: page.properties.Extra_Information.rich_text[0].text.content,
    };
  });

  return students;
};

const createStudent = async (name, phoneNumber, extraInfo) => {

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
  getStudents,
  createStudent,
};
