const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Clarifai = require('clarifai');

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
    // const picture = await Picture.update(
    //     { fileId: req.file.filename },
    //     { where: { name: req.params.name } }
    // ).catch(errHandler);


});

router.get('/', async (req, res) => {
    pictureUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Bachalpsee_reflection.jpg/1024px-Bachalpsee_reflection.jpg";
    // get predictions
    let predictions = await predict(pictureUrl);
    console.log(predictions)
    // get hashtags
    let hashtags = await getHashtags(predictions);
    res.json("jea")
});

const errHandler = (err) => {
    console.error("Error: ", err);
}

// return promis with hastags from predictions
const getHashtags = (predictions) => {

}

// returns promis with 7 predictions
const predict = (pictureUrl) => {
    return app.models.initModel({ id: Clarifai.GENERAL_MODEL, version: "aa7f35c01e0642fda5cf400f543e7c40" })
        .then(generalModel => {
            return generalModel.predict(pictureUrl);
        })
        .then(response => {
            const concepts = response['outputs'][0]['data']['concepts']
            predictions = concepts.map(el => el.name).slice(0, 7) // first 7 predictions
            return predictions;
        })
}

module.exports = router;
