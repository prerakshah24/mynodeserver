require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post('/ask', async (req, res) => {
    const userQuestion = req.body.question;
    console.log("Received question:", userQuestion); // Debugging

    const prompt = `You are an AI based on Premanand Maharaj's teachings. Answer in Hindi with Shaastra and Dharma references. Question: ${userQuestion}`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }]
        });

        console.log("OpenAI Response:", response); // Debugging

        if (response.choices && response.choices.length > 0) {
            res.json({ answer: response.choices[0].message.content });
        } else {
            console.log("No valid response from OpenAI");
            res.json({ answer: "कोई उत्तर नहीं मिला। कृपया पुनः प्रयास करें।" });
        }
    } catch (error) {
        console.error("Error from OpenAI:", error);
        res.status(500).json({ answer: "सर्वर में समस्या है। बाद में पुनः प्रयास करें।" });
    }
});

app.listen(5000, () => console.log('✅ Server running on port 5000'));
