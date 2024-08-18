const express = require('express');
const router = express.Router();
const sql = require('mssql');


router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Your Tree Emporium Order List</title>
                    <style>
                        body {font-family: Arial, sans-serif; text-align: center; margin: 20px;}
                        h1 {color: green;}
                        table {border-collapse: collapse; width: 80%; margin: 20px auto;}
                        th, td {border: 1px solid #ddd; padding: 8px; text-align: left;}
                        form {margin: 20px auto; width: 50%;}
                        label {display: block; margin-bottom: 8px;}
                        input[type="text"] {width: 100%; padding: 8px; box-sizing: border-box; margin-bottom: 16px;}
                        input[type="submit"] {background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer; font-size: 16px;}
                    </style>
                </head>
                <body>
                `);                
            let warehouseId = req.query.warehouseId;
    
            let sqlQuery = 'SELECT  productId, quantity, price FROM productinventory WHERE warehouseId = @warehouseId'
            let result = await pool.request()
            .input('warehouseId', sql.Int, warehouseId)
            .query(sqlQuery);
    
            res.write("<h1>Inventory List</h1>");
            res.write('<table><tr><th>Product ID</th><th>Warehouse</th><th>Quantity</th><th>Price</th></tr>');
    
            for (let i = 0; i < result.recordset.length; i++) {
                let record = result.recordset[i];
                res.write("<tr><td>" + record.productId + "</td>");
                res.write("<td>" + warehouseId + "</td>");
                res.write("<td>" + record.quantity + "</td>");
                res.write("<td>$" + record.price + "</td>");
                res.write("</tr>");
            }
            res.write(`
                </table>
                </form>
                <br>
                <h2>Edit Inventory</h2>
                <br>
                <form action="/editInventory" method="get">
                    <input type="hidden" name="warehouseId" value="${warehouseId}">
                    <label for="productId">Product Id: </label>
                    <input type="text" id="productId" name="productId">
                    <label for="quantity">New Quantity: </label>
                    <input type="text" id="quantity" name="quantity">
                    <input type="submit" value="Submit">
                </form>
                <h2><a href="/admin">Return to Admin Page</a></h2>
                </body>
                </html>
                `);                
            res.end();
    
        } catch (err) {
            console.dir(err);
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Error</title>
                </head>
                <body>
                    <h1>Error</h1>
                    <p>${err}</p>
                    <h3>Has the data been loaded?</h3>
                </body>
                </html>
                `);                
            res.end();
        }
    })();
});

module.exports = router;