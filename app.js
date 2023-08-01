// app.js
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

const API_KEY = 'cec7059f687fbe1815cdd0d70f23d097';

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
