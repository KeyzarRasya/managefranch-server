require('dotenv').config();
const express = require('express')
const multer = require('multer')
const path = require('path')
const {v4:uuid} = require('uuid')
const {createAccount, login, addFranchise, dropFranchise, addProduct, createTransaction} = require('../controller/Umkm');
const { default: axios } = require('axios');
const Tokenizer = require('../model/Token')

const storageLogo = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/asset/logo/")
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname))
    }
})

const logo = multer({storage:storageLogo})

const router = express.Router();

router.post('/signup', createAccount);
router.post('/login', login);
router.post('/add/franchise', addFranchise);
router.post('/drop/franchise/:franchId', dropFranchise);
router.post('/add/product', addProduct);

router.get('/purchase/:packet', createTransaction)

router.get('/finish', async(req, res) => {
    const {order_id, status_code, transaction_status} = req.query
    if(status_code !== "200"){
        return res.send('transaction pending')
    }
    const newToken = new Tokenizer({token:order_id});
    await newToken.save();
    console.log(newToken);
    res.redirect(`https://managefranch-client.vercel.app/signup/${order_id}`);
})

module.exports = router;