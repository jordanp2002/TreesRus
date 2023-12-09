const express = require('express');
const router = express.Router();
//coded with help of co-pilot/chatgpt
router.get('/', function(req, res, next) {
    const productIdToRemove = req.query.productId;
    if (req.session.productList) {
        req.session.productList = req.session.productList.filter(product => product && product.id !== productIdToRemove);
    }
    res.redirect('/showcart');
});
module.exports = router;
