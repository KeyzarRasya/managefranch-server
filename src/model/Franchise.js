const mongoose = require('mongoose')

const franchiseSchema = new mongoose.Schema({
    franchiseFrom:{
        type:mongoose.Schema.ObjectId,
        ref:'Umkm'
    }
})