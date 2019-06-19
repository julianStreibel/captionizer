const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Clarifai = require('clarifai');
const osmosis = require('osmosis');
const fetch = require("node-fetch");


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
    console.log(predictions);
    // get hashtags
    let hashtags = await getHashtags(predictions);
    // get 30 hashtags
    hashtags = hashtags.splice(0, 29).map(el => el.tag)
    // return hashtags and captions 
    res.json({
        hashtags: hashtags,
        captions: ["We gonna party like it`s your birthday",
            "The more money we come across, the more problems we see",
            "Drop it like it's hot",
            "To live doesn't mean you're alive",
            "I'm feelin' mysel"
        ]
    })
});

router.get('/', async (req, res) => {
    const q = await getQuotes();
    console.log(q.quoteText)
});

const errHandler = (err) => {
    console.error("Error: ", err);
}

// return promis with quotes and their author
const getQuotes = () => {
    console.log("start2")
    return fetch("https://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=en")
        .then((res) => res.json())
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
            .error(err => reject(err))
            .done(() => resolve(list));
    });

}

// returns promis with 3 predictions
const predict = (BASE64) => {
    return app.models.predict(Clarifai.GENERAL_MODEL, { base64: BASE64 })
        .then(response => {
            const concepts = response['outputs'][0]['data']['concepts']
            predictions = concepts.map(el => el.name).slice(0, 3) // first 3 predictions
            return predictions;
        })
}

module.exports = router;
