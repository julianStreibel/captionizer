const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// models
const User = require('../models/User');
const Picture = require('../models/Picture');

// /api/v1/picture/...
const router = express.Router();

// log
router.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

// lists all pictures with user
router.get('/', async (req, res) => {
    const pictures = await Picture.findAll({ include: [{ model: User, as: "User" }] }).catch(errHandler);
    res.json(pictures);
});

// get pictures by name with user
router.get('/:name', async (req, res) => {
    const picture = await Picture.findOne({ where: { name: req.params.name }, include: [{ model: User, as: "User" }] }).catch(errHandler);
    res.json(picture);
});

// updates picture by name
router.put('/:name', upload.single('image'), async (req, res) => {
    const picture = await Picture.update(
        { fileId: req.file.filename },
        { where: { name: req.params.name } }
    ).catch(errHandler);
    res.json(req.file.filename);
});

// creates new pictures                 >>>>>>>>>>>>>>>>>>>  TODO  <<<<<<<<<<<<<<<<
router.post('/', upload.single('image'), async (req, res) => {
    console.log(req.file);
    if (req.body.name && req.body.userId) {
        const picture = await Picture.create({
            name: req.body.name,
            fileId: req.file.filename,
            userId: req.body.userId
        }).catch(errHandler);
    }
});

const errHandler = (err) => {
    console.error("Error: ", err);
}

module.exports = router;
