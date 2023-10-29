const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();
require('./passport')

const PORT = process.env.PORT || 8000
connectDB()
const app = express();
app.use(cookieSession({
    maxAge: 20 * 1000,
    keys: [process.env.AUTH_SECRET],
    // httpOnly: true,
    // sameSite: process.env.NODE_ENV === 'Production'? 'none' : 'lax',
    // secure: process.env.NODE_ENV === 'Production'
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(cors({
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))

app.get('/', (req, res) => {
    res.json({ success: true })
})
app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
    '/auth/google/callback', 
    passport.authenticate('google'),
    (req, res) => {
        res.redirect(`${process.env.CLIENT_URL}`)
    }    
)


app.get('/auth/login/success', (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user? req.user : null,
    })
})

app.get('/auth/login/failure', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Login failed!'
    })
})

app.get('/auth/logout', (req, res) => {
    req.logout();
    req.session = null
    res.status(200).json({
        success: true,
        user: null
    })
    // res.redirect(`${process.env.CLIENT_URL}/login`)
})



app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`)
})