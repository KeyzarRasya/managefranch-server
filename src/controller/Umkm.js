const { jwtDecode } = require('jwt-decode');
const {saveAccount, loginCredential, insertFranchise, deleteFranchise, saveProduct, generateTransaction, afterPayment} = require('../service/Umkm')
const jwt = require('jsonwebtoken');

const createAccount = async(req, res) => {
    const {email, password, pemilik, alamat, token} = req.body;
    const save = await saveAccount({email, password, pemilik, alamat, token});
    res.send(save);
}

const login = async(req, res) => {
    const {email, password} = req.body;
    const account = await loginCredential({email, password});
    if(account.status !== 200){
        return res.send(account);
    }
    const token = await jwt.sign({user:account.umkm}, process.env.JWT_SECRET, {expiresIn:'1h'});
    res.cookie('token', token, {signed:true});
    res.send({loginInfo:account, token});
}

const addFranchise = async(req, res) => {
    const {pemilik, alamat, password} = req.body
    let umkm = jwtDecode(req.signedCookies.token);
    umkm = umkm.user
    const insert = await insertFranchise({pemilik, alamat, password}, umkm._id);
    res.send(insert);
}

const dropFranchise = async(req, res) => {
    const {franchId} = req.params;
    const umkm = jwtDecode(req.signedCookies.token);
    const deletedFranchise = await deleteFranchise(franchId, umkm.user._id)
    res.send(deletedFranchise);
}
const addProduct = async(req, res) => {
    const {namaProduk, harga, kuantitas} = req.body;
    const umkmCookie = jwtDecode(req.signedCookies.token);
    const product = await saveProduct({namaProduk, harga, kuantitas}, umkmCookie.user._id);
    res.send(product);
}

const createTransaction = async(req, res) => {
    const {packet} = req.params;
    const {email} = req.query;
    const transaction = await generateTransaction(packet, email);
    res.send(transaction.redirect_url); 
}

const paymentFinish = async(req, res) => {
    const {order_id, status_code} = req.query
    const checkPayment = await afterPayment({order_id, status_code});
    if(checkPayment.status !== 200){
        return res.send(checkPayment);
    }
    res.redirect(`https://managefranch-client.vercel.app/signup/${checkPayment.token}`);
    
}

module.exports = {createAccount, addProduct,login, addFranchise, dropFranchise, createTransaction, paymentFinish};