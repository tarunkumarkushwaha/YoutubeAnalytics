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

const allowedOrigins = process.env.ALLOWED_URL ? process.env.ALLOWED_URL.split(',') : [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
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

  // console.log(res.data)

  return res.data.items.map(video => ({
    // 1. IDENTIFIERS & ETAGS
    kind: video.kind,
    etag: video.etag,
    videoId: video.id,
    videoUrl: `https://www.youtube.com/watch?v=${video.id}`,

    // 2. SNIPPET (Basic Info)
    publishedAt: video.snippet.publishedAt,
    channelId: video.snippet.channelId,
    title: video.snippet.title,
    description: video.snippet.description,
    channelTitle: video.snippet.channelTitle,
    tags: video.snippet.tags || [], // Returns the raw array
    keywords: video.snippet.tags ? video.snippet.tags.join(", ") : "N/A", // Returns as string
    categoryId: video.snippet.categoryId,
    categoryName: categoryMapping[video.snippet.categoryId] || "N/A",
    liveBroadcastContent: video.snippet.liveBroadcastContent,
    defaultLanguage: video.snippet.defaultLanguage || "N/A",
    defaultAudioLanguage: video.snippet.defaultAudioLanguage || "N/A",

    // 3. THUMBNAILS (All resolutions)
    thumbnails: {
      default: video.snippet.thumbnails.default?.url,
      medium: video.snippet.thumbnails.medium?.url,
      high: video.snippet.thumbnails.high?.url,
      standard: video.snippet.thumbnails.standard?.url,
      maxres: video.snippet.thumbnails.maxres?.url
    },

    // 4. LOCALIZED CONTENT
    localized: {
      title: video.snippet.localized?.title,
      description: video.snippet.localized?.description
    },

    // 5. CONTENT DETAILS (Technical Specs)
    duration: video.contentDetails.duration,
    dimension: video.contentDetails.dimension, // e.g., "2d"
    definition: video.contentDetails.definition, // e.g., "hd"
    caption: video.contentDetails.caption === "true",
    licensedContent: video.contentDetails.licensedContent,
    projection: video.contentDetails.projection,
    contentRating: video.contentDetails.contentRating,

    // 6. STATISTICS (Engagement)
    viewCount: Number(video.statistics.viewCount || 0),
    likeCount: Number(video.statistics.likeCount || 0),
    favoriteCount: Number(video.statistics.favoriteCount || 0),
    commentCount: Number(video.statistics.commentCount || 0),

    // 7. SUPPLEMENTARY
    location: "N/A"
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

