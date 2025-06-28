const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
app.use(cors());
app.use(express.json());

// Replace <db_password> with your actual password
const uri = 'mongodb+srv://bhargavkrishna1819:<db_password>@cluster0.ejdw3ey.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);
let collection;

async function connectDB() {
    await client.connect();
    const db = client.db('bubblegame');
    collection = db.collection('highscores');
}
connectDB();

app.get('/highscores', async (req, res) => {
    const scores = await collection.find().sort({ score: -1 }).limit(10).toArray();
    res.json(scores);
});

app.post('/highscores', async (req, res) => {
    const { name, score } = req.body;
    if (typeof name === 'string' && typeof score === 'number') {
        await collection.insertOne({ name, score });
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: 'Invalid data' });
    }
});

app.listen(3000, '0.0.0.0', () => console.log('Server running on http://0.0.0.0:3000'));