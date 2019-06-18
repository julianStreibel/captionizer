const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
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
router.put('/', upload.single('image'), async (req, res) => {
});

router.get('/', async (req, res) => {
    pictureUrl = "https://www.woman.at/_storage/asset/10316179/storage/womanat:key-visual/file/136921909/marie%20fe%20jake%20snow.jpg";
    // get predictions
    let predictions = await predict(pictureUrl);
    // get hashtags
    let hashtags = await getHashtags(predictions);
    hashtags = hashtags.splice(0, 29).map(el => el.tag)
    console.log(hashtags)
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

const errHandler = (err) => {
    console.error("Error: ", err);
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
const predict = (pictureUrl) => {
    return app.models.initModel({ id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40" })
        .then(generalModel => {
            return generalModel.predict(pictureUrl);
        })
        .then(response => {
            const concepts = response['outputs'][0]['data']['concepts']
            predictions = concepts.map(el => el.name).slice(0, 3) // first 3 predictions
            return predictions;
        })
}

module.exports = router;
