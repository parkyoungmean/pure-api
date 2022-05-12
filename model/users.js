const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.USERS_DATABASE_ID;

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
      sorts: [
        {
          property: "CreatedAt",
          direction: "descending",
        },
      ],
    },  
  };
  const { results } = await notion.request(payload);

  const users = results.map((page) => {
    return {
      id: page.id,
      Name: page.properties.Name.title[0].text.content,
      Email: page.properties.Email.rich_text[0].text.content,
      PhoneNumber: page.properties.Phone_Number.rich_text[0].text.content,
      Img: page.properties.Img.rich_text[0].text.content,
      Greetings: page.properties.Greetings.rich_text[0].text.content,
      ExtraInformation:
        page.properties.Extra_Information.rich_text[0].text.content,
      CreatedAt: page.properties.CreatedAt.date.start,
      UpdatedAt: page.properties.UpdatedAt.date.start,
      Bookmark: page.properties.Bookmark.rich_text[0].text.content,
    };
  });

  return users;
};

const createUser = async (name, email, phoneNumber, img, greetings, extraInfo, createdAt, updatedAt, bookmark) => {
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
      Email: {
        rich_text: [
          {
            text: {
              content: email,
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
      Img: {
        rich_text: [
          {
            text: {
              content: img,
            },
          },
        ],
      },
      Greetings: {
        rich_text: [
          {
            text: {
              content: greetings,
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
      Bookmark: {
        rich_text: [
          {
            text: {
              content: bookmark,
            },
          },
        ],
      },
      Status: {
        rich_text: [
          {
            text: {
              content: 'created',
            },
          },
        ],
      },
    },
  });

  return response;
};



const updateUser = async (id, name, email, phoneNumber, img, greetings, extraInfo, createdAt, updatedAt, bookmark) => {
  const response = await notion.pages.update({
    parent: { database_id: database_id },
    page_id: id,
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
      Email: {
        rich_text: [
          {
            text: {
              content: email,
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
      Img: {
        rich_text: [
          {
            text: {
              content: img,
            },
          },
        ],
      },
      Greetings: {
        rich_text: [
          {
            text: {
              content: greetings,
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
      Bookmark: {
        rich_text: [
          {
            text: {
              content: bookmark,
            },
          },
        ],
      },
      Status: {
        rich_text: [
          {
            text: {
              content: 'updated',
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
  updateUser,
};
