const express = require('express')
const multer = require('multer')
const path = require('path')
const {v4:uuid} = require('uuid')
const midtrans = require('midtrans-client');
const {createAccount, login, addFranchise, dropFranchise, addProduct} = require('../controller/Umkm');
const { default: axios } = require('axios');

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
        },
        "item-details":[{
            "price":parseInt(packet),
            "name":packet === "30000" ? "Newpreneur" : "Propreneur",
            "token":uuid()
        }]
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

router.get('/finish', async(req, res) => {
    const {order_id, status_code, transaction_status} = req.query
    if(status_code !== "200"){
        return res.send('transaction pending')
    }
    const response = await axios.get(`${process.env.PG_BASE}/v2/${order_id}/status`, {
        headers:{
            'Content-Type':'application/json',
            'Accept':'application/json',
            'Authorization':`Basic ${btoa(process.env.SERVER_KEY)}`
        }
    })
    res.send(response);
})

module.exports = router;