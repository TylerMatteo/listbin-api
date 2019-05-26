import express from 'express';
import User from './models/User';
import jwt from 'jsonwebtoken';

const app = express(),
    port = 3000;

app.get('/', (req, res) => res.send('Base route'));

app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    const user = new User({ emai, password });
    user.save(err => {
        if(err) {
            res.status(500).send("Error registering new user please try again.");
        } else {
            res.status(200).send("Registration successful.");
        }
    });
});

app.post('/api/authenticate', (req, res) => {
    const { email, password } = req.body;
    // User exec() here so we execute the query and get back a Promise
    User.findOne({ email }).exec().then( user => {
        if (!user){
            res.status(401)
                .json({
                    error: 'Incorrect email or password'
                });
        } else {
            return user.isCorrectPassword(password)
        }
    }, err => {
        res.status(500)
            .json({
                error: 'Internal error please try again'
            });
    }).then( match => {
        if (!match) {
            res.status(401)
                .json({
                    error: 'Incorrect email or password'
                });
        } else {
            const payload = { email };
            const token = jwt.sign(payload, secret, {
                expiresIn: '1h'
            });
            res.cookie('token', token, { httpOnly: true })
                .sendStatus(200);
        }
    }, err => {
        res.status(500)
            .json({
                error: 'Internal error please try again'
            });
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`));