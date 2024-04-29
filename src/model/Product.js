const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    namaProduk:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    kuantitas:{
        type:Number,
        require:true,
    },
    price:{
        type:Number,
        require:true,
    }
})