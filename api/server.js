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

// Routes


// test
app.get('/api/v1/test', (req, res) => {
    res.json({
        hashtags: ["Cool", "Instagood", "pod", "Weed", "idk"],
        captions: ["We gonna party like it`s your birthday",
            "The more money we come across, the more problems we see",
            "Drop it like it's hot",
            "To live doesn't mean you're alive",
            "I'm feelin' mysel"
        ]
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);