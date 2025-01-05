const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShortUrlSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  shortId: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ShortUrl = mongoose.model("shortUrl", ShortUrlSchema);
module.exports = ShortUrl;
