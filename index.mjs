import express from 'express';

const app = express(),
    port = 3000;

app.get('/', (req, res) => res.send('Base route'));

app.listen(port, () => console.log(`Listening on port ${port}`));