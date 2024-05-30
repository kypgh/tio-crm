import axios from "axios";

const baseUrl = `${process.env.NEXT_PUBLIC_AI_BLOGPOSTS_API_URL}/api`;

export default {
  scrapePages: async (arr) => {
    const res = await axios.post(`${baseUrl}/scrapPages`, {
      pages: arr,
    });
    return res.data;
  },
  publishBlog: async () => {
    const res = await axios.get(`${baseUrl}/createBlog`);
    return res.data;
  },
};
