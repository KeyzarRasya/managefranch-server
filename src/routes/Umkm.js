require('dotenv').config();
const express = require('express')
const multer = require('multer')
const path = require('path')
const {v4:uuid} = require('uuid')
const {createAccount, login, addFranchise, dropFranchise, addProduct, createTransaction, paymentFinish} = require('../controller/Umkm');
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

router.get('/finish', paymentFinish)

module.exports = router;