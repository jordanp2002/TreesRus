const express = require('express');
const router = express.Router();
const sql = require('mssql');

//coded with help of co-pilot
router.get('/', function(req, res, next) {
    const updatedQuantities = req.query; 
    if (req.session.productList) {
        req.session.productList.forEach(product => {
            if (product && product.id) {
                const productId = product.id.toString();
                if (updatedQuantities.hasOwnProperty('quantity-' + productId)) {
                    const newQuantity = parseInt(updatedQuantities['quantity-' + productId], 10);
                    if (!isNaN(newQuantity) && newQuantity > 0) {
                        product.quantity = newQuantity;
                    }
                }
            }
        });
    }
    res.redirect('/showcart');
});
module.exports = router;