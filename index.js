/**
 * The main application file.
 * @module app
 */

const express = require('express');
const shortid = require('shortid');
const createHttpError = require('http-errors');
const mongoose = require('mongoose');
const path = require('path');
const ShortUrl = require('./models/mongoose');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/url-shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Main route
app.get('/', async (req, res, next) => {
  try {
    res.render('index');
  } catch (err) {
    next(err);
  }
});

// Route for creating a new short URL
app.post('/', async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      throw createHttpError.BadRequest('URL is required');
    }
    const existingUrl = await ShortUrl.findOne({ url });
    if (existingUrl) {
      res.render('index', { short_url: `http://localhost:3500/${existingUrl.shortId}` });
      return;
    }
    const newShortUrl = new ShortUrl({ url, shortId: shortid.generate() });
    const savedUrl = await newShortUrl.save();
    res.render('index', { short_url: `http://localhost:3500/${savedUrl.shortId}` });
  } catch (err) {
    next(err);
  }
});

// Route for redirecting short URLs
app.get('/:shortId', async (req, res, next) => {
  try {
    const { shortId } = req.params;
    const shortUrl = await ShortUrl.findOne({ shortId });
    if (!shortUrl) {
      throw createHttpError.NotFound('Short URL not found');
    }
    res.redirect(shortUrl.url);
  } catch (err) {
    next(err);
  }
});

// 404 error handler
app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('index', { error: err.message });
});

// Start the server
app.listen(3500, () => console.log('Server is running on port 3500'));

