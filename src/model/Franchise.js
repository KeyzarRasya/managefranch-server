const mongoose = require('mongoose')

const franchiseSchema = new mongoose.Schema({
    franchiseFrom:{
        type:mongoose.Schema.ObjectId,
        ref:'Umkm'
    },
    franchiseID:{
        type:String,
        require:true
    },
    pemilik:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    alamat:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    requestProduct:[{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        default:[]
    }],
    moneyReport:[{
        type:mongoose.Schema.ObjectId,
        ref:'Report',
        default:[]
    }]
})

const Model = mongoose.model('Franchise', franchiseSchema);

module.exports = Model;