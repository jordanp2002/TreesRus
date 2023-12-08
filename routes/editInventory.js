const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res,next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Editing Inventory</title>");
    let warehouseId =  req.query.warehouseId;
    let productId = req.query.productId;
    let quantity = req.query.quantity;
    
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            let sqlQuery = "UPDATE productinventory SET quantity = @quantity WHERE warehouseId = @warehouseId AND productId = @productId";
            let result = await pool.request()
                .input('warehouseId', sql.Int, warehouseId)
                .input('productId', sql.Int, productId)
                .input('quantity', sql.Int, quantity)
                .query(sqlQuery);
                res.write("<h1>Inventory Updated New Quantity: " + quantity + "</h1>");
                res.write("<h2><a href=\"/InventoryView?warehouseId=" + warehouseId +"\">Return to View Inventory</a></h2>");
                res.end();
            return true;
        } catch (err) {
            console.dir(err);
            res.write(err.toString());
            return false;
        }
        })();
        
});
module.exports = router;