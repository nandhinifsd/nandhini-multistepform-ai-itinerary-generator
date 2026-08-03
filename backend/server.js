const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
async function callGroq(prompt) 
{
    const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7
                })
            }
        );
 if (!response.ok) {
        throw new Error(`Groq Error: ${response.status}`);
    }

    return await response.json();
    }


app.get("/", (req, res) => {
    res.send("JourneyCraft Backend is running!");
});
//generatetrip endpoint
app.post("/generate-trip", async (req, res) => {

    try {

        const { prompt } = req.body;

        const data = await callGroq(prompt);

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to generate trip"
        });

    }

});

//formatripendpoint
app.post("/format-trip", async (req, res) => {

    try {

        const { prompt } = req.body;

        const data = await callGroq(prompt);

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to format trip"
        });

    }

});

app.get("/api/location-search", async (req, res) => {
    try {
        const place = req.query.text;

        const response = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(place)}&apiKey=${process.env.GEOAPIFY_API_KEY}`
        );

        const data = await response.json();

        res.json(data);
    }
    catch(error) {
        console.log(error);
        res.status(500).json({
            error: "Geoapify request failed"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});