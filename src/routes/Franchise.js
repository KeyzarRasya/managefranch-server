const express = require('express');
const {loginFranchise, saveReport, requestOrder} = require('../controller/Franchise');

const router = express.Router();

router.post('/login', loginFranchise);
router.post("/add/report", saveReport);
router.post('/request/product/:productId', requestOrder);
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.send('successlogout');
})

module.exports = router;