const Umkm = require('../model/Umkm');
const bcrypt = require('bcrypt');

const saveAccount = async(umkm) => {
    umkm.password = await bcrypt.hash(umkm.password, 12);
    const newUmkm = new Umkm(umkm);
    await newUmkm.save();
    return {status:200, message:"account created successfully", umkm:newUmkm};
}

const loginCredential = async(umkm) => {
    const findUmkm = await Umkm.findOne({email:umkm.email});
    if(!findUmkm){
        return {status:406, message:'You enter the wrong email'}
    }
    const isValid = await bcrypt.compare(umkm.password, findUmkm.password);
    return isValid ? {status:200, message:'Login success', umkm:findUmkm} : {status:406, message:'Wrong password'};
}

module.exports = {saveAccount, loginCredential};