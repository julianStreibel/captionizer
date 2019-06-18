const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

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
    // res.json( req.file.filename);
});

const errHandler = (err) => {
    console.error("Error: ", err);
}

module.exports = router;
