const express = require('express');
const router = express.Router();
const sql = require('mssql');


router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            //html coded with help of copilot/chatgpt
            res.write('<!DOCTYPE html>');
            res.write('<html lang="en">');
            res.write('<head>');
            res.write('<meta charset="UTF-8">');
            res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
            res.write('<title>Your Tree Emporium Order List</title>');
            res.write('<style>');
            
            res.write('body {font-family: Arial, sans-serif; text-align: center; margin: 20px;}');
            res.write('h1 {color: green;}');
            res.write('table {border-collapse: collapse; width: 80%; margin: 20px auto;}');
            res.write('th, td {border: 1px solid #ddd; padding: 8px; text-align: left;}');
            res.write('form {margin: 20px auto; width: 50%;}');
            res.write('label {display: block; margin-bottom: 8px;}');
            res.write('input[type="text"] {width: 100%; padding: 8px; box-sizing: border-box; margin-bottom: 16px;}');
            res.write('input[type="submit"] {background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer; font-size: 16px;}');
            res.write('</style>');
            res.write('</head>');
            res.write('<body>');
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
            res.write("</table>");
            res.write('</form>');
            res.write('</br>');
            res.write('<h2>Edit Inventory</h2>');
            res.write('</br>');
            res.write('<form action="/editInventory" method="get">');
            res.write('<input type="hidden" name="warehouseId" value="' +warehouseId + '">');
            res.write('<label for="productId">Product Id: </label>');
            res.write('<input type="text" id="productId" name="productId">');
            res.write('<label for="quantity">New Quantity: </label>');
            res.write('<input type="text" id="quantity" name="quantity">');
            res.write('<input type="submit" value="Submit">');
            res.write('</form>');
            res.write("<h2><a href=\"/admin\">Return to Admin Page</a></h2>");
            res.write('</body>');
            res.write('</html>');
            res.end();
    
        } catch (err) {
            console.dir(err);
            res.write('<!DOCTYPE html>');
            res.write('<html lang="en">');
            res.write('<head>');
            res.write('<meta charset="UTF-8">');
            res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
            res.write('<title>Error</title>');
            res.write('</head>');
            res.write('<body>');
            res.write('<h1>Error</h1>');
            res.write('<p>' + err + '</p>');
            res.write('<h3>Has the data been loaded?</h3>');
            res.write('</body>');
            res.write('</html>');
            res.end();
        }
    })();
});

module.exports = router;