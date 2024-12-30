const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/url-shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));