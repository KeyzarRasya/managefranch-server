const mongoose = require('mongoose');

const umkmSchema = new mongoose.Schema({
    umkmName:{
        type:String,
        require:true
    },
    logo:{
        type:String,
        default:null
    },
    alamat:{
        type:String,
        require:true
    },
    pemilik:{
        type:String,
        require:true
    },
    franchise:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Franchise',
            default:[]
        }
    ],
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    premiumToken:{
        type:String
    },
    moneyReport:[{
        type:mongoose.Schema.ObjectId,
        ref:'Report',
        default:[]
    }]
})

const Model = mongoose.model('Umkm', umkmSchema);

module.exports = Model;