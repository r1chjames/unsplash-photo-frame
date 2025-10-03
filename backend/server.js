
require('dotenv').config({ path: '../.env' });
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

const { UNSPLASH_ACCESS_KEY, UNSPLASH_USERNAME, REFRESH_INTERVAL } = process.env;

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/config', (req, res) => {
  res.json({
    refreshInterval: REFRESH_INTERVAL
  });
});

app.get('/api/app-config', (req, res) => {
  res.json({
    splitPercentage: process.env.SPLIT_PERCENTAGE || 50,
    iframeUrl: process.env.IFRAME_URL || 'https://www.google.com/search?igu=1'
  });
});

app.get('/api/random-photo', async (req, res) => {
  if (!UNSPLASH_ACCESS_KEY || !UNSPLASH_USERNAME) {
    return res.status(500).json({ error: 'Unsplash credentials are not configured.' });
  }

  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        username: UNSPLASH_USERNAME,
        orientation: 'landscape',
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    const photo = response.data;
    res.json({
      imageUrl: photo.urls.regular,
      photographer: photo.user.name,
      profileUrl: photo.user.links.html,
      exif: photo.exif,
      location: photo.location,
      description: photo.description,
    });
  } catch (error) {
    console.error('Error fetching photo from Unsplash:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch photo from Unsplash.' });
  }
});

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
