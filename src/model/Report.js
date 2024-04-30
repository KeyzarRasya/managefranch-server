const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    date:{
        type:Date,
        default:Date.now()
    },
    pemasukan: [{
        nama: { type: String, required: true },
        biayaSatuan: { type: Number, required: true },
        kuantitas: { type: Number, required: true }
      }],
      pengeluaran: [{
        nama: { type: String, required: true },
        biayaSatuan: { type: Number, required: true },
        kuantitas: { type: Number, required: true }
      }]
});

const Model = mongoose.model('Report', reportSchema);

module.exports = Model;