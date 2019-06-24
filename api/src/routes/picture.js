const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Clarifai = require('clarifai');
const osmosis = require('osmosis');
const axios = require('axios');

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
    let quotes = await getCaptionsFromInsta(predictions[0]);
    let i = 1;
    while (quotes.length < 4 || i < 3) {
        quotes.push.apply(quotes, await getCaptionsFromInsta(predictions[i]));
        i++;
    }
    shuffle(quotes);
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

// returns captions from insta from the given tag. Data is sortet in relevance
const getCaptionsFromInsta = async (tag) => {

    return axios.get(`https://www.instagram.com/explore/tags/${tag}/?__a=1`)
        .then(response => {
            let data = response.data.graphql.hashtag.edge_hashtag_to_media.edges;
            data = data.map(d => {
                if (d.node.edge_media_to_caption.edges.length > 0 && d.node.edge_media_to_caption.edges[0].node.text.split('#'))
                    caption = d.node.edge_media_to_caption.edges[0].node.text.split('#')[0].replace(/\n/g, '');
                else
                    caption = d.node.edge_media_to_caption.edges.length > 0 ? d.node.edge_media_to_caption.edges[0].node.text.replace(/\n/g, '') : null

                return {
                    quote: caption,
                    likes: d.node.edge_media_to_comment.count,
                    comments: d.node.edge_liked_by.count
                }
            })
            return data.sort((a, b) => (b.comments + b.likes - a.comments - a.likes)).filter(c => c.quote && !(c.quote.length < 1)).filter(d => d.comments > 100);
        })
        .catch(error => {
            console.log(error);
        });
}


// shuffles an array
const shuffle = (array) => {
    let i = 0;
    while (i < 30) {
        array.sort(() => Math.random() - 0.5);
        i++;
    }
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
            .done(() => resolve(list.filter(q => q.quote.length < 210).map(q => {
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
            .error(err => resolve([]))
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
