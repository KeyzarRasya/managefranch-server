const {saveAccount} = require('../service/Umkm')

const createAccount = async(req, res) => {
    const {email, password, pemilik, alamat} = req.body;
    const save = await saveAccount({email, password, pemilik, alamat});
    res.send(save);
}

module.exports = {createAccount};