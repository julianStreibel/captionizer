'use strict';

const express = require('express');
const cors = require('cors');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// test
app.get('/api/v1/test', (req, res) => {
    res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);