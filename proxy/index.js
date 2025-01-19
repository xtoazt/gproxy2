const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");

const app = express();

// Randomized User-Agent headers to mimic real browsers
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
];

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// CORS middleware to allow requests from any origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Proxy middleware
app.use(
  "/",
  createProxyMiddleware({
    target: "https://www.google.com",
    changeOrigin: true,
    secure: false,
    headers: {
      "User-Agent": getRandomUserAgent(),
      "Accept-Language": "en-US,en;q=0.9",
    },
    onError(err, req, res) {
      console.error("Proxy Error:", err);
      res.status(500).send("Internal Server Error");
    },
    onProxyRes(proxyRes, req, res) {
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
    },
  })
);

// Export the app for Vercel
module.exports = app;
