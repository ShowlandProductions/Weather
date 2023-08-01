// server.js

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

const API_KEY = 'cec7059f687fbe1815cdd0d70f23d097';

// Enable CORS to allow requests from different origins
app.use(cors());

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch weather data' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
