/**
 * The main application file.
 * @module app
 */
const express = require('express');
const shortid = require('shortid');
const { createHttpError } = require('http-errors');
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
mongoose.connect('mongodb://localhost:27017/url=shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting...'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Main route
app.get('/', async (req, res, next) => {
  try {
    res.render('index');
  } catch (error) {
    next(error);
  }
});

// Route for creating a new Short URL
app.post('/', async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      throw createHttpError.BadRequest('URL is required');
    }
    const urlExists = await ShortUrl.findOne({ url });
    if (urlExists) {
      res.render('index', { short_url: `http://localhost:3500/${urlExists.shortId}` });
      return;
    }
    const shortId = new ShortUrl({ url: url, shortId: shortid.generate() });
    const result = await shortId.save();
    res.render('index', { short_url: `http://localhost:3500/${result.shortId}` });
  } catch (error) {
    next(error);
  }
});

// Route for redirecting short URLs
app.get('/:shortId', async (req, res, next) => {
  try {
    const { shortId } = req.params;
    const result = await ShortUrl.findOne({ shortId });
    if (!result) {
      throw createHttpError.NotFound('Short URL not found');
    }
    res.redirect(result.url);
  } catch (error) {
    next(error);
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
app.listen(3000, () => console.log('Server is running on port 3000'));

