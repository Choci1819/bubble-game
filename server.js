const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let highScores = []; // In-memory, use a database for production

app.get('/highscores', (req, res) => {
    res.json(highScores.slice(0, 10));
});

app.post('/highscores', (req, res) => {
    const { name, score } = req.body;
    highScores.push({ name, score });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 10);
    res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));