/**
 * The main application file.
 * @module app
 */
const express = require('express'); // The Express framework
const shortId = require('shortid'); // A library for generating short IDs
const createHttpError = require('http-errors'); // A library for creating HTTP errors
const mongoose = require('mongoose'); // A library for connecting to MongoDB
const path = require("path"); // A library for working with file paths

const app = express(); // Initialize the Express application

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: false }));

/**
 * Connect to the MongoDB database
 * @param {string} url - The URL of the MongoDB server
 * @param {Object} options - The options for connecting to the MongoDB server
 */
mongoose.connect('mongodb://localhost:27017/url-shortener', { dbName: 'url-shortener',

  // Use the new URL parser
  useNewUrlParser: true,

  // Use the new topology engine
  useUnifiedTopology: true,

  // Use the new findOneAndUpdate() method
  useFindAndModify: false, 

  // Use the new createIndex() method
  useCreateIndex: true
}).then(() => {
  console.log('Connected to MongoDB');
});


app.set('view engine', 'ejs');

app.get('/', async (req, res, next) => {
  res.render('index');
})

app.post('/', async (req, res, next) => {
    
})

app.listen(3500, () => console.log('Server is running on port 3500'));