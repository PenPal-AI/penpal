const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path'); // Import the 'path' module

const app = express();
const port = process.env.PORT || 3000;
console.log("port: ", port);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// **INSERT THE API KEY HERE**
const OPENAI_API_KEY = "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";

// Serve static files from the 'public' directory
app.use(express.static("."));
app.set('view engine', 'html');
app.get('/', function(req, res) {
        res.render('index');
});

app.post('/analyze-text', async (req, res) => {
    const { text } = req.body;
    console.log('Received text:', text)
    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo-0125",
                messages: [
                    {
                    role: "user",
                    content: `Review the following student writing for any grammar, spelling, and punctuation errors:\n\n"${text}"\n\nProvide corrections and explanations:`,
                    }
                ],
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const corrections = response.data.choices[0].message.content.trim();

        res.json({ originalText: text, corrections });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to analyze text' });
    }
});

// Remove the previous app.get('/') route handler

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
