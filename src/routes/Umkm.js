const express = require('express')
const multer = require('multer')
const path = require('path')
const {v4:uuid} = require('uuid')
const midtrans = require('midtrans-client');
const {createAccount, login, addFranchise, dropFranchise, addProduct} = require('../controller/Umkm')

let snap = new midtrans.Snap({
    isProduction:false,
    serverKey:process.env.SERVER_KEY
})

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

router.get('/purchase/:packet', async (req, res) => {
    const {packet} = req.params;
    const {email} = req.query;
    console.log(email)
    let  parameter = {
        "transaction_details":{
            "order_id":uuid(),
            "gross_amount":0
        },
        "credit_card":{
            "secure":true
        },
        "customer_details":{
            "first_name":"KeyzarRasya",
            "last_name":"Athallah",
            "email":email
        }
    } 
    
    if(packet === "30000"){
       parameter.transaction_details.gross_amount = 30000
    }else if(packet === "50000"){
        parameter.transaction_details.gross_amount = 50000
    }else{
        return res.status(400).send('Please choose a packet')
    }

    const transaction = await snap.createTransaction(parameter);
    res.redirect(transaction.redirect_url); 

})

router.get('/finish', (req, res) => {
    res.redirect('https://managefranch-client.vercel.app/finish');
})

module.exports = router;