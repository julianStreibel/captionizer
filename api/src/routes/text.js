const express = require('express');

// models
const User = require('../models/User');
const Text = require('../models/Text');

// /api/v1/text/...
const router = express.Router();

// log
router.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// lists all texts with user
router.get('/', async (req, res) => {
    const texts = await Text.findAll({ include: [{ model: User, as: "User" }] }).catch(errHandler);
    res.json(texts);
});

// get texts by name with user
router.get('/:name', async (req, res) => {
    const texts = await Text.findOne({ where: { name: req.params.name }, include: [{ model: User, as: "User" }] }).catch(errHandler);
    res.json(texts);
});

// updates texts by name
router.put('/:name', async (req, res) => {
    const text = await Text.update(
        { text: req.body.text },
        { where: { name: req.params.name } }
    ).catch(errHandler);
});

// creates new text
router.post('/', async (req, res) => {
    if (req.body.text && req.body.name && req.body.userId) {
        const text = await Text.create({
            name: req.body.name,
            text: req.body.text,
            userId: 1                       // TODO!
        }).catch(errHandler);
    }
});

const errHandler = (err) => {
    console.error("Error: ", err);
}

module.exports = router;
