import express from "express";
import axios from "axios";
import { writeToPath } from "fast-csv";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(express.json());

const API_KEY = process.env.YT_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

app.use(cors({
  origin: process.env.ALLOWED_URL,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

const categoryMapping = {
  1: 'Film & Animation',
  2: 'Autos & Vehicles',
  10: 'Music',
  15: 'Pets & Animals',
  17: 'Sports',
  18: 'Short Movies',
  19: 'Travel & Events',
  20: 'Gaming',
  21: 'Videoblogging',
  22: 'People & Blogs',
  23: 'Comedy',
  24: 'Entertainment',
  25: 'News & Politics',
  26: 'How-to & Style',
  27: 'Education',
  28: 'Science & Technology',
  29: 'Nonprofits & Activism',
  30: 'Movies',
  31: 'Anime/Animation',
  32: 'Action/Adventure',
  33: 'Classics',
  34: 'Comedy',
  35: 'Documentary',
  36: 'Drama',
  37: 'Family',
  38: 'Foreign',
  39: 'Horror',
  40: 'Sci-Fi/Fantasy',
  41: 'Thriller',
  42: 'Shorts',
  43: 'Shows',
  44: 'Trailers',
};

async function fetchVideos({ query, categoryId, maxResults = 50 }) {
  let videos = [];
  let pageToken = "";

  while (videos.length < maxResults) {
    const params = {
      key: API_KEY,
      part: "snippet",
      type: "video",
      maxResults: 50,
      pageToken,
    };

    if (query?.trim()) params.q = query;
    if (categoryId) params.videoCategoryId = categoryId;

    const res = await axios.get(`${BASE_URL}/search`, { params });

    const ids = res.data.items.map(i => i.id.videoId);
    if (!ids.length) break;

    const details = await fetchVideoDetails(ids);
    videos.push(...details);

    pageToken = res.data.nextPageToken;
    if (!pageToken) break;
  }

  return videos.slice(0, maxResults);
}


async function fetchVideoDetails(videoIds) {
  const res = await axios.get(`${BASE_URL}/videos`, {
    params: {
      key: API_KEY,
      id: videoIds.join(","),
      part: "snippet,contentDetails,statistics",
    },
  });

  return res.data.items.map(video => ({
    videoId: video.id,
    url: `https://www.youtube.com/watch?v=${video.id}`,

    title: video.snippet.title,
    description: video.snippet.description,
    channel: video.snippet.channelTitle,
    keywords: video.snippet.tags
      ? video.snippet.tags.join(", ")
      : "N/A",
    categoryId: video.snippet.categoryId,
    category: categoryMapping[video.snippet.categoryId] || "N/A",
    publishedAt: video.snippet.publishedAt,
    duration: video.contentDetails.duration,
    viewCount: Number(video.statistics.viewCount || 0),
    commentCount: Number(video.statistics.commentCount || 0),
    captionsAvailable: video.contentDetails.caption === "true",
    location: "N/A",
  }));
}


function getKeywordFrequency(videos) {
  const frequency = {};

  videos.forEach(video => {
    if (!video.keywords || video.keywords === "N/A") return;

    video.keywords
      .split(",")
      .map(k => k.trim().toLowerCase())
      .forEach(k => {
        if (!k) return;
        frequency[k] = (frequency[k] || 0) + 1;
      });
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([keyword, count]) => ({ keyword, count }));
}

app.post("/api/videos/export", async (req, res) => {
  const videos = await fetchVideos(req.body);
  const filePath = path.resolve("youtube_data.csv");

  writeToPath(filePath, videos, { headers: true })
    .on("finish", () => res.download(filePath));
});

app.post("/api/videos/json", async (req, res) => {
  const videos = await fetchVideos(req.body);
  res.json({ count: videos.length, videos });
});

app.post("/api/videos/keywords", async (req, res) => {
  const videos = await fetchVideos(req.body);
  const keywords = getKeywordFrequency(videos);

  res.json({
    totalVideos: videos.length,
    uniqueKeywords: keywords.length,
    keywords,
  });
});


app.listen(5000, () => console.log("Server running on port 5000"));

