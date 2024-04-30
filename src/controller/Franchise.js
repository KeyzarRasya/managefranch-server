const { jwtDecode } = require('jwt-decode');
const {saveMoneyReport, loginCredential, createOrder} = require('../service/Franchise');
const jwt = require('jsonwebtoken');

const saveReport = async(req, res) => {
    const {pemasukan, pengeluaran} = req.body;
    const franchise = jwtDecode(req.signedCookies.token);
    const report = await saveMoneyReport({pemasukan, pengeluaran}, franchise.user._id);
    res.send(report);
}

const loginFranchise = async(req, res) => {
    const {franchiseID, password} = req.body;
    const findFranchise = await loginCredential(franchiseID, password);
    if(findFranchise.status !== 200){
        return res.send(findFranchise);
    }
    const token = await jwt.sign({user:findFranchise.franchise}, process.env.JWT_SECRET, {expiresIn:'1h'});
    res.cookie('token', token, {signed:true});
    res.send({findFranchise, token});
}

const requestOrder = async(req, res) => {
    const {kuantitas} = req.body;
    const {productId} = req.params;
    const franchise = jwtDecode(req.signedCookies.token);
    console.log(franchise);
    const makeOrder = await createOrder(productId, franchise.user._id, kuantitas);
    res.send(makeOrder)
}

module.exports = {loginFranchise, saveReport, requestOrder};