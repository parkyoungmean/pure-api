const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.MEMBERS_DATABASE_ID;

const getDatabase = async () => {
  const response = await notion.databases.retrieve({
    database_id: database_id,
  });
  /* console.log(response); */
};

const getMembers = async () => {
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
        or: [{ property: "Status", rich_text: { does_not_contain: "deleted" }}],
      },
    },
  };
  const { results } = await notion.request(payload);

  const members = results.map((page) => {
    return {
      id: page.id,
      Email: page.properties.Email.title[0].text.content,
      Name: page.properties.Name.rich_text[0].text.content,
      PhoneNumber: page.properties.Phone_Number.rich_text[0].text.content,
      Avatar: page.properties.Avatar.rich_text[0].text.content,
      Role: page.properties.Role.rich_text[0].text.content,
      Bookmark: page.properties.Bookmark.rich_text[0].text.content,
      CreatedAt: page.properties.CreatedAt.date.start,
      UpdatedAt: page.properties.UpdatedAt.date.start,
      Status: page.properties.Status.rich_text[0].text.content,
    };
  });

  return members;
};


const createMember = async (email, hash, name, phoneNumber, avatar, role, bookmark, createdAt, updatedAt) => {
  const response = await notion.pages.create({
    parent: { database_id: database_id },
    properties: {
      Email: {
        title: [
          {
            text: {
              content: email,
            },
          },
        ],
      },
      Password: {
        rich_text: [
          {
            text: {
              content: hash,
            },
          },
        ],
      },
      Name: {
        rich_text: [
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
      Avatar: {
        rich_text: [
          {
            text: {
              content: avatar,
            },
          },
        ],
      },
      Role: {
        rich_text: [
          {
            text: {
              content: role,
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
              content: "created",
            },
          },
        ],
      },
    },
  });
  
  return response;
};
  
const findOne = async (email) => {
  
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
                { property: "Email", title: { equals: email } },
                { property: "Status", rich_text: { does_not_contain: "deleted" } },
            ],
        },
    },
  };
  
  const { results } = await notion.request(payload);

  const member = results.map((page) => {
    return {
        id: page.id,
        Email: page.properties.Email.title[0].text.content,
        Password: page.properties.Password.rich_text[0].text.content,
        Name: page.properties.Name.rich_text[0].text.content,
        Phone_Number: page.properties.Phone_Number.rich_text[0].text.content,
        Avatar: page.properties.Avatar.rich_text[0].text.content,
        Role: page.properties.Role.rich_text[0].text.content,
        Bookmark: page.properties.Bookmark.rich_text[0].text.content,
        CreatedAt: page.properties.CreatedAt.date.start,
        UpdatedAt: page.properties.UpdatedAt.date.start,
        Status: page.properties.Status.rich_text[0].text.content,
    };
  });

  return member;
}


  module.exports = {
    getMembers,
    createMember,
    findOne,
  };