const { jwtDecode } = require('jwt-decode');
const Franchise = require('../model/Franchise');
const Report = require('../model/Report');
const Product = require('../model/Product');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const loginCredential = async(franchiseID, password) => {
    const franchise = await Franchise.findOne({franchiseID});
    if(!franchise){
        return {status:406, message:'your franchiseID is wrong'}
    }
    const isValid = await bcrypt.compare(password, franchise.password);
    return isValid? {status:200, message:'Login succesfully', franchise} :
    {status:406, message:'wrong password'};
}

const saveMoneyReport = async(moneyReport, franchiseId) => {
    const report = new Report(moneyReport);
    console.log(franchiseId);
    const findFranchise = await Franchise.findById(franchiseId);
    if(!findFranchise){
        return {status:401, message:'franchise unknown, you should login'};
    }
    findFranchise.moneyReport.push(report);
    await findFranchise.save();
    await report.save();
    return {status:200, message:'Successfully added money report'};
}

const createOrder = async(productId, franchiseId, kuantitas) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const findProduct = await Product.findById(productId)
        const findFranchise = await Franchise.findById(franchiseId)
        console.log(findFranchise);
        if(!findFranchise && !findProduct){
            throw new Error('Product or franchise not found');
        }
        const sisaBarang = findProduct.kuantitas - kuantitas;
        if(sisaBarang < 0){
            throw new Error('Kuantitas barang tidak mencukupi kuantitas yang diinginkan');
        }
        findProduct.kuantitas = sisaBarang;
        findFranchise.requestProduct.push(findProduct);
        await findProduct.save();
        await findFranchise.save();
        session.commitTransaction();
        session.endSession()
        return {status:200, message:"Order created"};
    }catch(err){
        await session.abortTransaction();
        session.endSession();
        return {status:400, message: err.message};
    }
}

module.exports = {saveMoneyReport, loginCredential, createOrder};