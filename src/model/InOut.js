const mongoose = require('mongoose')

const inOutSchema = new mongoose.Schema({
    nama:{
        type:String,
        require:true
    },
    biayaSatuan:{
        type:Number,
        require:true
    },
    kuantitas:{
        type:Number,
        require:true
    }
})