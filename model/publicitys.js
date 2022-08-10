const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.NOTICES_DATABASE_ID;

const getDatabase = async () => {
  const response = await notion.databases.retrieve({
    database_id: database_id,
  });
  console.log(response);
};

/* getDatabase(); */

const getPublicitys = async () => {
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

  const publicitys = results.map((page) => {
    return {
      id: page.id,
      Title: page.properties.Title.title[0].text.content,
      Subtitle: page.properties.Subtitle.rich_text[0].text.content,
      Content: page.properties.Content.rich_text[0].text.content,
      Img: page.properties.Img.rich_text[0].text.content,
      MobileImg: page.properties.MobileImg.rich_text[0].text.content,
      Condition: page.properties.Condition.rich_text[0].text.content,
      Belong: page.properties.Belong.rich_text[0].text.content,
      Author: page.properties.Author.rich_text[0].text.content,
      Position: page.properties.Position.rich_text[0].text.content,
      Size: page.properties.Size.rich_text[0].text.content,
      Color: page.properties.Color.rich_text[0].text.content,
      CreatedAt: page.properties.CreatedAt.date.start,
      UpdatedAt: page.properties.UpdatedAt.date.start,
      Status: page.properties.Status.rich_text[0].text.content,
    };
  });

  return publicitys;
};

const createPublicity = async (
  img,
  mobileImg,
  title,
  subtitle,
  content,
  condition,
  belong,
  author,
  position,
  size,
  color,
  createdAt,
  updatedAt
) => {
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
      MobileImg: {
        rich_text: [
          {
            text: {
              content: mobileImg,
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
      Position: {
        rich_text: [
          {
            text: {
              content: position,
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
};

const updatePublicity = async (
  id,
  img,
  mobileImg,
  title,
  subtitle,
  content,
  condition,
  belong,
  author,
  position,
  size,
  color,
  createdAt,
  updatedAt
) => {
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
      Img: {
        rich_text: [
          {
            text: {
              content: img,
            },
          },
        ],
      },
      MobileImg: {
        rich_text: [
          {
            text: {
              content: mobileImg,
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
      Position: {
        rich_text: [
          {
            text: {
              content: position,
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
              content: "updated",
            },
          },
        ],
      },
    },
  });

  return response;
};

module.exports = {
  getPublicitys,
  createPublicity,
  updatePublicity,
};
