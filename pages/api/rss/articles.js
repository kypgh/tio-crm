import axios from "axios";
import * as cheerio from "cheerio";
import { XMLParser } from "fast-xml-parser";

async function getFxStreetFeed() {
  try {
    const res = await axios
      .get("https://www.fxstreet.com/rss/forex")
      .then((res) => res.data);
    const parser = new XMLParser();
    const jsObj = parser.parse(res);
    let result = jsObj?.rss?.channel?.item;

    if (result?.length > 0) {
      return result.map((article) => ({
        title: article.title,
        description: article.description,
        link: article.link,

        // createdAt: new Date(article["a10:updated"]).toISOString(),
        createdAt: new Date(article["pubDate"]).toISOString(),
      }));
    }
    return [];
  } catch (err) {
    console.error("fxStreetFeed Error", err.toJSON ? err.toJSON() : err);
    return [];
  }
}

async function getDailyFxFeed() {
  try {
    const res = await axios
      .get("https://www.dailyfx.com/feeds/technical-analysis", {
        headers: {
          "Accept-Encoding": "gzip, deflate, br",
        },
      })
      .then((res) => res.data);
    const parser = new XMLParser();
    const jsObj = parser.parse(res);
    let result = jsObj?.rss?.channel?.item;
    if (result?.length > 0) {
      return result.map((article) => ({
        title: article.title,
        description: article.description,
        link: article.link,

        createdAt: new Date(article.pubDate).toISOString(),
      }));
    }
    return [];
  } catch (err) {
    console.error("DailyFxFeed Error", err.toJSON ? err.toJSON() : err);
    return [];
  }
}

function extractContent(html) {
  return cheerio.load(html).text();
}

async function getForexLiveFeed() {
  try {
    const res = await axios
      .get("https://www.forexlive.com/feed/technicalanalysis")
      .then((res) => res.data);
    const parser = new XMLParser();
    const jsObj = parser.parse(res);
    let result = jsObj?.rss?.channel?.item;
    if (result?.length > 0) {
      return result.map((article) => ({
        title: article.title,
        description: extractContent(article.description),
        link: article.link,

        createdAt: new Date(article.pubDate).toISOString(),
      }));
    }
    return [];
  } catch (err) {
    console.error("ForexLiveFeed Error", err.toJSON ? err.toJSON() : err);
    return [];
  }
}

async function getMarketPulseFeed() {
  try {
    const res = await axios
      .get("https://www.marketpulse.com/rss")
      .then((res) => res.data);
    const parser = new XMLParser();
    const jsObj = parser.parse(res);
    let result = jsObj?.rss?.channel?.item;
    if (result?.length > 0) {
      return result.map((article) => ({
        title: article.title,
        description: article.description,
        link: article.link,

        createdAt: new Date(jsObj?.rss?.channel?.lastBuildDate).toISOString(),
      }));
    }
    return [];
  } catch (err) {
    console.error("ForexLiveFeed Error", err.toJSON ? err.toJSON() : err);
    return [];
  }
}

async function getForexCrunchFeed() {
  try {
    const res = await axios
      .get("https://www.forexcrunch.com/feed/")
      .then((res) => res.data);
    const parser = new XMLParser();
    const jsObj = parser.parse(res);
    let result = jsObj?.rss?.channel?.item;
    if (result?.length > 0) {
      return result.map((article) => ({
        title: article.title,
        description: extractContent(article.description),
        link: article.link,

        createdAt: new Date(article.pubDate).toISOString(),
      }));
    }
    return [];
  } catch (err) {
    console.error("ForexLiveFeed Error", err.toJSON ? err.toJSON() : err);
    return [];
  }
}

async function getForexTechnical() {
  try {
    const res = await axios
      .get("https://www.investing.com/rss/forex_Technical.rss")
      .then((res) => res.data);
    const parser = new XMLParser();
    const jsObj = parser.parse(res);
    let result = jsObj?.rss?.channel?.item;
    if (result?.length > 0) {
      return result.map((article) => ({
        title: article.title,
        description: extractContent(article?.description || ""),
        link: article.link,
        createdAt: new Date(article.pubDate).toISOString(),
      }));
    }
    return [];
  } catch (err) {
    console.error("ForexTechnical Error", err.toJSON ? err.toJSON() : err);
    return [];
  }
}

async function getXmFeed() {
  try {
    const res = await axios
      .get("https://www.xm.com/feed")
      .then((res) => res.data);
    const parser = new XMLParser();
    const jsObj = parser.parse(res);
    let result = jsObj?.rss?.channel?.item;
    if (result?.length > 0) {
      return result.map((article) => ({
        title: article.title,
        description: extractContent(article?.description || ""),
        link: article.link.replace(
          ".com",
          ".com/research/analysis/technicalAnalysis/xm"
        ),
        createdAt: new Date(article.pubDate).toISOString(),
      }));
    }
    return [];
  } catch (err) {
    console.error("XM Error", err.toJSON ? err.toJSON() : err);
    return [];
  }
}

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  if (req.method === "GET") {
    let result = {
      fxstreet: [],
      dailyfx: [],
      forexlive: [],
      marketpulse: [],
      forexcrunch: [],
      forextechnical: [],
      xm: [],
    };

    const all = await Promise.all([
      getFxStreetFeed(),
      getDailyFxFeed(),
      getForexLiveFeed(),
      getMarketPulseFeed(),
      getForexCrunchFeed(),
      getForexTechnical(),
      getXmFeed(),
    ]);
    result.fxstreet = all[0];
    result.dailyfx = all[1];
    result.forexlive = all[2];
    result.marketpulse = all[3];
    result.forexcrunch = all[4];
    result.forextechnical = all[5];
    result.xm = all[6];

    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
