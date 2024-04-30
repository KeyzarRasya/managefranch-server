require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const umkmRoute = require('./src/routes/Umkm')
const franchiseRouter = require('./src/routes/Franchise');
const cookieParser = require('cookie-parser')
const session = require('express-session');

mongoose.connect(process.env.MONGODB_URI)
.then(res => console.log('Connected to database'))
.catch(err => console.log(err));

const app = express();
const port = process.env.PORT || 3001;

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))

app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

app.use('/umkm', umkmRoute);
app.use('/franchise', franchiseRouter);

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})