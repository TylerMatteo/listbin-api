import express from 'express';
import User from './models/User.mjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';

const app = express(),
    port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const mongodbPassword = process.env.MONGOPW;
console.log({mongodbPassword})
const mongo_uri = `mongodb+srv://Mattayo45:${mongodbPassword}@cluster0-ekvvn.mongodb.net/ListBin?retryWrites=true&w=majority`;
mongoose.connect(mongo_uri, { useNewUrlParser: true }, function(err) {
  if (err) {
    throw err;
  } else {
    console.log(`Successfully connected to ${mongo_uri}`);
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.send('Base route'));

app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    const user = new User({ email, password });
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
            const token = jwt.sign(payload, process.env.SECRET, {
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