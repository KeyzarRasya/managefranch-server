const Umkm = require('../model/Umkm');
const Franchise = require('../model/Franchise')
const bcrypt = require('bcrypt');
const {v4:uuid} = require('uuid')

const saveAccount = async(umkm) => {
    const findEmail = await Umkm.findOne({email:umkm.email});
    if(findEmail){
        return {status:401, message:'Email already used'};
    }
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

const insertFranchise = async(metadata, umkmId) => {
    const findUmkm = await Umkm.findById(umkmId);
    if(!findUmkm){
        return {status:406, message:'Data anda belum terdaftar'};
    }
    const franchiseId = uuid();
    metadata.password = await bcrypt.hash(metadata.password, 12);
    const newFranchise = new Franchise({
        alamat:metadata.alamat,
        pemilik:metadata.pemilik,
        password:metadata.password,
        franchiseID:franchiseId,
        franchiseFrom:umkmId
    })
    findUmkm.franchise.push(newFranchise);
    await findUmkm.save();
    await newFranchise.save();
    return {status:200, message:'Franchise added!', franchise:newFranchise};
}

module.exports = {saveAccount, loginCredential, insertFranchise};