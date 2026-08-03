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

app.get("/users", async (req, res) => {

    try {

        const phone = req.query.phone;
        const username = req.query.username;

        let query;

        if (phone) {
            query = db.collection("users")
                     .where("phone", "==", phone);
        } 
        else if (username) {
            query = db.collection("users")
                     .where("username", "==", username);
        }

        const snapshot = await query.get();

        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(users);

    } catch(error) {
        console.log(error);

        res.status(500).json({
            error: "Failed to fetch users"
        });
    }

}); 

app.post("/users", async (req, res) => {

    try {

        const user = req.body;

        const docRef = await db.collection("users").add(user);

        res.json({
            id: docRef.id,
            message: "User created successfully"
        });

    } catch(error) {

        console.log(error);

        res.status(500).json({
            error: "Failed to create user"
        });
    }

});

app.post("/trips", async (req, res) => {

    try {

        const trip = req.body;

        const docRef = await db.collection("trips").add({
            ...trip,
            createdAt: new Date()
        });

        res.json({
            id: docRef.id,
            message: "Trip saved successfully"
        });

    } catch(error) {

        console.log(error);

        res.status(500).json({
            error: "Failed to save trip"
        });
    }

});

app.get("/trips", async (req, res) => {
    try {
        const snapshot = await db.collection("trips").get();

        const trips = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(trips);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch trips"
        });
    }
});

app.get("/trips/:id", async (req, res) => {
    try {
        const doc = await db.collection("trips").doc(req.params.id).get();

        if (!doc.exists) {
            return res.status(404).json({
                error: "Trip not found"
            });
        }

        res.json({
            id: doc.id,
            ...doc.data()
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch trip"
        });
    }
});

app.patch("/trips/:id", async (req, res) => {
    try {
        const tripId = req.params.id;
        const updates = req.body;

        await db.collection("trips").doc(tripId).update(updates);

        res.json({
            message: "Trip updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to update trip"
        });
    }
});

app.delete("/trips/:id", async (req, res) => {
    try {
        await db.collection("trips").doc(req.params.id).delete();

        res.json({
            message: "Trip deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to delete trip"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});