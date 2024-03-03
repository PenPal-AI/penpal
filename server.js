const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// OpenAI API key (replace 'your_openai_api_key' with your actual key)
const OPENAI_API_KEY = 'your_openai_api_key';

app.post('/analyze-text', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            {
                prompt: `Review the following student writing for any grammar, spelling, and punctuation errors:\n\n"${text}"\n\nProvide corrections and explanations:`,
                temperature: 0.5,
                max_tokens: 250,
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

        const corrections = response.data.choices[0].text.trim();
        res.json({ originalText: text, corrections });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to analyze text' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});