require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const umkmRoute = require('./src/routes/Umkm')

mongoose.connect(process.env.MONGODB_URI)
.then(res => console.log('Connected to database'))
.catch(err => console.log(err));

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

app.use('/umkm', umkmRoute);

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})