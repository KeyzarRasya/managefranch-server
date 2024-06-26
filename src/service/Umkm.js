const Umkm = require('../model/Umkm');
const Franchise = require('../model/Franchise')
const Product = require('../model/Product');
const Tokenizer = require('../model/Token')
const bcrypt = require('bcrypt');
const {v4:uuid} = require('uuid')
const midtrans = require('midtrans-client');
const { default: axios } = require('axios');

let snap = new midtrans.Snap({
    isProduction:false,
    serverKey:process.env.SERVER_KEY
})


const saveAccount = async(umkm) => {
    const findEmail = await Umkm.findOne({email:umkm.email});
    const findToken = await Tokenizer.findOne({token:umkm.token})
    if(findEmail){
        return {status:401, message:'Email already used'};
    }
    if(!findToken){
        return {status:401, message:'Unknown token'};
    }
    if(findToken.isUsed){
        return {status:401, message:'token is already used'};
    }
    umkm.password = await bcrypt.hash(umkm.password, 12);
    const newUmkm = new Umkm(umkm);
    newUmkm.premiumToken = findToken.token;
    findToken.isUsed = true;
    await newUmkm.save();
    await findToken.save();
    return {status:200, message:"account created successfully", umkm:newUmkm};
}

const loginCredential = async(umkm) => {
    const findUmkm = await Umkm.findOne({email:umkm.email});
    console.log(findUmkm);
    if(!findUmkm){
        return {status:406, message:'You enter the wrong email'}
    }
    const findToken = await Tokenizer.findOne({token:findUmkm.premiumToken});
    if(!findToken){
        return {status:401, message:'you dont have premium access'};
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

const deleteFranchise = async(franchiseID, umkmID) => {
    const findUmkm = await Umkm.findById(umkmID);
    const findFranchise = await Franchise.findById(franchiseID);
    if(!findUmkm && !findFranchise){
        return {status:401, message:'You are not allowed to do this action'};
    }
    let deletedFranchiseIndex = -1; 
    findUmkm.franchise.forEach((franch, index) => {
        if(franch.toString() === franchiseID){
            deletedFranchiseIndex = index;
        }
    })
    if(deletedFranchiseIndex === -1){
        return {status:404, message:'there is no franchise to delete'};
    }
    findUmkm.franchise.splice(deletedFranchiseIndex, 1);
    await Franchise.deleteOne({_id:findFranchise._id});
    await findUmkm.save();
    return {status:200, message:'Successfuly deleted a franchise', deletedFranchise:findFranchise};
}

const saveProduct = async(product, umkmId) => {
    const products = new Product(product);
    const umkm = await Umkm.findById(umkmId);
    if(!umkm){
        return {status:401, message:'You have to login first'};
    }
    umkm.product.push(products);
    await umkm.save();
    await products.save();
    return {status:200, message:'Product saved', umkm, products};
}

const generateTransaction = async(packet, email) => {
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
    return transaction;
}

const afterPayment = async(paymentInfo) => {
    const response = await axios({
        method:'GET',
        url:`https://api.sandbox.midtrans.com/v2/${paymentInfo.order_id}/status`,
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization':`Basic ${btoa(process.env.SERVER_KEY)}`
        }
    })
    const data = response.data;
    if(data.status_code !== "200" && data.transaction_status !== "settlement"){
        return {response:data, status:401};
    }

    const findOrderToken = await Tokenizer.findOne({order_id:data.order_id});
    console.log(findOrderToken)
    if(findOrderToken){
        return {status:200, token:findOrderToken.token}
    }
    const tokenid = uuid();
    const newToken = new Tokenizer({token:tokenid, order_id:data.order_id});
    await newToken.save();
    return {response:response.data, token:tokenid, status:200};
}

module.exports = 
{saveAccount, 
    loginCredential, 
    insertFranchise, 
    deleteFranchise, 
    saveProduct, 
    generateTransaction, 
    afterPayment};