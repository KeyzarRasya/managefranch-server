const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    date:{
        type:Date,
        default:Date.now()
    },
    pemasukan:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'InOut',
            default:[]
        }
    ],
    pengeluaran:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'InOut',
            default:[]
        }
    ]
})