const express = require('express')
const multer = require('multer')
const path = require('path')
const {createAccount, login, addFranchise, dropFranchise} = require('../controller/Umkm')

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

module.exports = router;