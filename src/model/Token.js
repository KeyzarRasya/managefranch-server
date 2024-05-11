const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token:{
        type:String,
        require:true
    },
    signedAt:{
        type:Date,
        default:Date.now()
    },
    isUsed:{
        type:Boolean,
        default:false,
        require:true
    },
    order_id:{
        type:String,
        require:true
    }
})

const Model = mongoose.model('Tokenizer', tokenSchema);

module.exports = Model;