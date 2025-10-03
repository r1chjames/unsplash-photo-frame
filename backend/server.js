
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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
