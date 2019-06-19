'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");

const picture = require('./src/routes/picture');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Routes
app.use('/api/v1/picture', picture)

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);