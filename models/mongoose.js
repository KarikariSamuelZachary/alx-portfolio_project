const moongoose = require('moongoose');
const Schema = moongoose.Schema;

const ShortUrlScema = new Schema({
    url: {
        type: String,
        required: true
    },

    shortId: {
        type: String,
        required: true
    }
});

const ShortUrl = moongoose.model('ShortUrl', ShortUrlScema);

