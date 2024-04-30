const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    namaProduk:{
        type:String,
        require:true
    },
    image:{
        type:String,
        default:""
    },
    kuantitas:{
        type:Number,
        require:true,
    },
    harga:{
        type:Number,
        require:true,
    },
    requestFrom:{
        type:mongoose.Schema.ObjectId,
        ref:'Franchise'
    },
    isCompleted:{
        type:Boolean,
        default:false
    }
})

const Model = mongoose.model('Product', productSchema);

module.exports = Model;