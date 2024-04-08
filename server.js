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

    option = 'persuasive';

    let prompt;
    if (option === 'academic') {
        prompt = `I am writing an academic paper. Review my writing and respond in the second person:\n\n"${text}"\n\nProvide suggestions for expanding on existing ideas or arguments.
        Provide insight on tone (give suggestions and explanations on whether or not the tone matches the assignment and genre). Offer suggestions for integrating quotes or references, Which sentences or ideas should be expanded on through analysis or additional evidence?:`;
    } else if (option === 'research') {
        prompt = `I am writing a research paper. Review the my writing and respond in the second person:\n\n"${text}"\n\nProvide suggestions for expanding on existing ideas or arguments.
        Provide insight on tone (give suggestions and explanations on whether or not the tone matches the assignment and genre). How can the clarity of writing flow improve from introduction to body to conclusion? Make suggestions as to how they can expand on meaningful analysis or additional evidence research`;
    } else if (option === 'persuasive') {
        prompt = `I am writing a persuasive essay. Review the my writing and respond in the second person:\n\n"${text}"\n\nProvide suggestions for expanding on existing ideas or arguments.
        Provide insight on tone (give suggestions and explanations on whether or not the tone matches the assignment and genre).Offer suggestions for developing a stronger thesis statement or main argument.
        Provide prompts to help brainstorm potential counterarguments:`;
    } else if (option === 'profemail') {
        prompt = `I am writing a professional email. Review the my writing and respond in the second person:\n\n"${text}"\n\nProvide suggestions for expanding on existing ideas or arguments.
        Provide insight on tone (give suggestions and explanations on whether or not the tone matches the assignment and genre). Offer suggestions for professional greetings and verbiage`;
    } else {
        return res.status(400).json({ error: 'Invalid option selected' });
    }

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
                    content: `Review the my writing and respond in the second person:\n\n"${text}"\n\nProvide suggestions for expanding on existing ideas or arguments.
                    Provide insight on tone (give suggestions and explanations on whether or not the tone matches the assignment and genre):`,
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
