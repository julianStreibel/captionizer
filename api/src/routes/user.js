const express = require('express');

// models
const User = require('../models/User');
const Text = require('../models/Text');

// /api/v1/users/...
const router = express.Router();

// log
router.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// lists all users with texts
router.get('/', async (req, res) => {
    const users = await User.findAll({ include: [{ model: Text, as: "Text" }] }).catch(errHandler);
    res.json(users);
});

// creates new user
router.post('/', async (req, res) => {
    if (req.body.username && req.body.password) {
        const user = await User.create({
            username: req.body.username,
            password: req.body.password
        }).catch(errHandler);
    }
});

const errHandler = (err) => {
    console.error("Error: ", err);
}

module.exports = router;
