// routes/chat.js
const express = require('express');
const fs = require('fs');
const axios = require('axios');
const router = express.Router();
const path = require('path');
// Load context from a text file (make sure the path is correct)
// In routes/chat.js
const context = fs.readFileSync(path.join(__dirname, './context.txt'), 'utf8');

// Gemini 2.0 Flash API aconfiguration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyA-ZkogfBxtEX0Hh9DOLNknqd6rqHABAQg';

async function generateResponse(question) {
    const prompt = `Context: ${context}\n\nQuestion: ${question}\n\nAnswer:`;

    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error('Error generating response:', error.response ? error.response.data : error.message);
        return 'Sorry, I could not generate an answer. Please check the API key and endpoint.';
    }
}

// Chat endpoint
router.post('/ask', async (req, res) => {
    const question = req.body.question;
    console.log(question)

    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    const answer = await generateResponse(question);
    res.json({ question, answer });
});

module.exports = router;