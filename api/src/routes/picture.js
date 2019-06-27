const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Clarifai = require('clarifai');
const osmosis = require('osmosis');


// Clarifai
const app = new Clarifai.App({
    apiKey: '0c53abfa6be24c60b85ec377118dbf58'
});

// /api/v1/picture/...
const router = express.Router();

// log
router.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// uploads picture and return list of hashtags and captions
router.post('/', multer({ dest: './uploads/' }).single("image"), async (req, res) => {
    // file to base64
    const BASE64 = new Buffer.from(fs.readFileSync(req.file.path)).toString("base64");
    // get predictions
    const predictions = await predict(BASE64);
    // get hashtags
    let hashtags = await getHashtags(predictions.slice(0, 3)); // first 3 predictions
    // get 30 hashtags
    hashtags = hashtags.splice(0, 29).map(el => el.tag)
    // get captions
    let quotes = await getQuotes(predictions[0]);
    let i = 1;
    while (quotes.length < 4) {
        quotes = await getQuotes(predictions[i]);
        i++;
    }
    // return hashtags and captions 
    res.json({
        predictions: predictions,
        hashtags: hashtags,
        captions: quotes
    })
});

const errHandler = (err) => {
    console.error("Error: ", err);
}

// return promis with captiond from predictions output = [... {author: "einstein", quote: "blabalhaha"}, ...]
const getQuotes = (prediction) => {
    return new Promise((resolve, reject) => {
        let list = [];
        osmosis
            // Scrape top hashtags
            .get(`https://www.goodreads.com/quotes/tag/${prediction}`)
            // All hashtags exist inside of a div with class 
            .find('.quoteDetails')
            // Create an object of data
            .set({
                quote: '.quoteText',
                author: '.quoteText > span'
            })
            .data(data => {
                // Each iteration, push the data into our array
                list.push(data);
            })
            .error(err => resolve([]))
            .done(() => resolve(list.filter(q => q.quote.length < 1000).map(q => {
                q.quote = q.quote.split('“')[1].split('”')[0]
                return q
            })));
    });
}

// return promis with hastags from predictions output = [... { tag: '# explore' }, ...]
const getHashtags = (predictions) => {
    return new Promise((resolve, reject) => {
        let list = [];
        osmosis
            // Scrape top hashtags
            .get(`https://app.sistrix.com/app_instagram/_result/lang/de?tag=${predictions[0]}%20${predictions[1]}%20l${predictions[2]}`)
            // All hashtags exist inside of a div with class col-lg-12
            .find('.instatag-active')
            // Create an object of data
            .set({
                tag: 'div', // Link to the app
            })
            .data(data => {
                // Each iteration, push the data into our array
                list.push(data);
            })
            .error(err => resolve(['\u0065\u0301']))
            .done(() => resolve(list));
    });
}

// returns promis with predictions
const predict = (BASE64) => {
    return app.models.predict(Clarifai.GENERAL_MODEL, { base64: BASE64 })
        .then(response => {
            const concepts = response['outputs'][0]['data']['concepts']
            predictions = concepts.map(el => el.name)
            return predictions;
        })
}

module.exports = router;
