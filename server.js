const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

const CLAUDE_API_KEY = 'your_claude_api_key';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/complete';

app.post('/analyze-text', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        prompt: `Review the following text for any grammar, spelling, and punctuation errors:\n\n"${text}"\n\nProvide corrections and explanations:`,
        model: 'claude-v1',
        max_tokens_to_sample: 250,
        stop_sequences: ['\n'],
        temperature: 0.5,
        top_p: 1,
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const corrections = response.data.completion.trim();
    res.json({ originalText: text, corrections });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});

app.post('/generate-suggestion', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        prompt: `Provide suggestions to improve the following text:\n\n"${text}"\n\nSuggestions:`,
        model: 'claude-v1',
        max_tokens_to_sample: 250,
        stop_sequences: ['\n'],
        temperature: 0.5,
        top_p: 1,
      },
      {
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const suggestions = response.data.completion.trim();
    res.json({ originalText: text, suggestions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});