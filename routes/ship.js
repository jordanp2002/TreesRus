const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');


router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');

    res.write('<title>YOUR NAME Grocery Shipment Processing</title>');

    let orderId = req.query.orderId;
    orderId = parseInt(orderId);
    if (isNaN(orderId)) {
        res.write("<h1>Invalid order id.</h1>");
        res.end();
        return;
    }

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            let sqlQuery = "SELECT orderId, productId, quantity, price FROM orderproduct WHERE orderId = @orderId";

            let results = await pool.request()
                .input('orderId', sql.Int, orderId)
                .query(sqlQuery);

            if (results.recordset.length === 0) {
                res.write("<h1>Invalid order id or no items in order.</h1>");
                res.end();
                return;
            } else {
                results = results.recordset;

                // Begin setting up/processing the transaction
                const transaction = new sql.Transaction(pool);
                transaction.begin(async err => {
                    if (err) {
                        console.dir(err);
                        return;
                    }

                    let sqlQuery = "INSERT INTO shipment (shipmentDate, warehouseId) VALUES (@date, 1);";
                    await transaction.request()
                        .input("date", sql.DateTime, moment().format('Y-MM-DD HH:mm:ss'))
                        .query(sqlQuery);

                    let sqlQuery1 = "SELECT quantity FROM productinventory WHERE warehouseId = 1 and productId = @id";
                    let sqlQuery2 = "UPDATE productinventory SET quantity = @available WHERE warehouseId = 1 and productId = @id";
                    let success = true;

                    for (let i = 0; i < results.length; i++) {
                        let orderedProduct = results[i];
                        let productId = orderedProduct.productId;
                        let quantity = orderedProduct.quantity;

                        let inventoryResults = await transaction.request()
                            .input("id", sql.Int, productId)
                            .query(sqlQuery1);
                        if (inventoryResults.recordset.length > 0 && inventoryResults.recordset[0].quantity < quantity) {
                            // No inventory record
                            res.write("<h1>Shipment not done. Insufficient inventory for product id: " + productId + "</h1>");
                            success = false;
                            break;
                        }
                        let inventory = inventoryResults.recordset[0].quantity;
                        let available = inventory - quantity;
                        await transaction.request()
                            .input("available", sql.Int, available)
                            .input("id", sql.Int, productId)
                            .query(sqlQuery2);
                            
                            res.write("<h2>Ordered product: "+productId+" Qty: "+quantity+" Previous inventory: "+inventory+" New inventory: "+available+"</h2><br>");
                    }

                    if (success) {
                        await transaction.commit();
                    } else {
                        await transaction.rollback();
                    }

                    res.end()
                });
            }
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
