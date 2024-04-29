const {saveAccount, loginCredential} = require('../service/Umkm')
const jwt = require('jsonwebtoken');

const createAccount = async(req, res) => {
    const {email, password, pemilik, alamat} = req.body;
    const save = await saveAccount({email, password, pemilik, alamat});
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

module.exports = {createAccount, login};