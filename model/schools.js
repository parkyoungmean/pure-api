const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const database_id = process.env.SCHOOLS_DATABASE_ID;

const getDatabase = async () => {
    const response = await notion.databases.retrieve({
        database_id: database_id,
    });
    console.log(response);
}

/* getDatabase(); */

const getSchools = async () => {
  const payload = {
    path: `databases/${database_id}/query`,
    method: `POST`,
    body: {
      sorts: [
        {
          property: "CreatedAt",
          direction: "ascending",
        },
      ],
      filter: {
        or: [{ property: "Status", rich_text: { does_not_contain: "deleted" }}],
      },
    },
  };
  const { results } = await notion.request(payload);

  const schools = results.map((page) => {
    return {
      id: page.id,
      Name: page.properties.Name.title[0].text.content,
      Subtitle: page.properties.Subtitle.rich_text[0].text.content,
      Img: page.properties.Img.rich_text[0].text.content,
      Description: page.properties.Description.rich_text[0].text.content,
      Curriculum: page.properties.Curriculum.rich_text[0].text.content,
      Registration: page.properties.Registration.rich_text[0].text.content,
      Graduate: page.properties.Graduate.rich_text[0].text.content,
      Color: page.properties.Color.rich_text[0].text.content,
      CreatedAt: page.properties.CreatedAt.date.start,
      UpdatedAt: page.properties.UpdatedAt.date.start,
      Bookmark: page.properties.Bookmark.rich_text[0].text.content,
      Status: page.properties.Status.rich_text[0].text.content,
    };
  });

  return schools;
};


const createSchool = async (
  name,
  subtitle,
  img,
  description,
  curriculum,
  registration,
  graduate,
  color,
  createdAt,
  updatedAt,
  bookmark
) => {
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
      Subtitle: {
        rich_text: [
          {
            text: {
              content: subtitle,
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
      Description: {
        rich_text: [
          {
            text: {
              content: description,
            },
          },
        ],
      },
      Curriculum: {
        rich_text: [
          {
            text: {
              content: curriculum,
            },
          },
        ],
      },
      Registration: {
        rich_text: [
          {
            text: {
              content: registration,
            },
          },
        ],
      },
      Graduate: {
        rich_text: [
          {
            text: {
              content: graduate,
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


const updateSchool = async (
  id,
  name,
  subtitle,
  img,
  description,
  curriculum,
  registration,
  graduate,
  color,
  createdAt,
  updatedAt,
  bookmark
) => {
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
      Subtitle: {
        rich_text: [
          {
            text: {
              content: subtitle,
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
      Description: {
        rich_text: [
          {
            text: {
              content: description,
            },
          },
        ],
      },
      Curriculum: {
        rich_text: [
          {
            text: {
              content: curriculum,
            },
          },
        ],
      },
      Registration: {
        rich_text: [
          {
            text: {
              content: registration,
            },
          },
        ],
      },
      Graduate: {
        rich_text: [
          {
            text: {
              content: graduate,
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
    getSchools,
    createSchool,
    updateSchool,
}
