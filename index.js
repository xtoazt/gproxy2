const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// CORS bypass middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(204); // No Content
  } else {
    next();
  }
});

// Proxy configuration
const targetUrl = "https://www.google.com"; // Google target
app.use(
  "/",
  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    secure: false, // Bypass SSL verification if needed
    onProxyRes(proxyRes, req, res) {
      // Modify headers if necessary
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
    },
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
