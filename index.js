// File: index.js
// Commit: Add complete Railway relay server to proxy requests to ngrok backend.

import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Load ngrok backend URL from Railway environment variable
const NGROK_URL = process.env.NGROK_URL;
if (!NGROK_URL) {
  throw new Error("Missing NGROK_URL environment variable");
}

// ---------------------------------------------------------
// Health Check
// ---------------------------------------------------------
app.get("/", (req, res) => {
  res.status(200).json({ status: "Railway relay online" });
});

// ---------------------------------------------------------
// Hello World Forwarder (GET)
// ---------------------------------------------------------
app.get("/helloworld", async (req, res) => {
  try {
    const upstream = `${NGROK_URL}/helloworld`;
    const r = await fetch(upstream);
    const body = await r.text();
    res.status(r.status).send(body);
  } catch (err) {
    res.status(500).json({ error: "Relay failed", details: err.message });
  }
});

// ---------------------------------------------------------
// Category Prediction (POST)
// ---------------------------------------------------------
app.post("/predict_category", async (req, res) => {
  try {
    const upstream = `${NGROK_URL}/predict_category`;

    const r = await fetch(upstream, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const body = await r.text();
    res.status(r.status).send(body);
  } catch (err) {
    res.status(500).json({ error: "Relay failed", details: err.message });
  }
});

// ---------------------------------------------------------
// Business Prediction (POST)
// ---------------------------------------------------------
app.post("/predict_business", async (req, res) => {
  try {
    const upstream = `${NGROK_URL}/predict_business`;

    const r = await fetch(upstream, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const body = await r.text();
    res.status(r.status).send(body);
  } catch (err) {
    res.status(500).json({ error: "Relay failed", details: err.message });
  }
});

// ---------------------------------------------------------
// Server Listen
// ---------------------------------------------------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Relay server running on port ${PORT}`);
});
