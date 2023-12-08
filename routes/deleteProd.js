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
            res.write('</style>');
            res.write('</head>');
            res.write('<body>');
            
            let productName = req.query.productName;
            let sqlSelect = 'SELECT * FROM product WHERE productName = @productName'
            let resultSelect = await pool.request().input('productName', sql.VarChar, productName).query(sqlSelect);
            let productId = resultSelect.recordset[0].productId;

            let sqlQuery = 'DELETE FROM productinventory WHERE productId = @productId'
            let sqlQuery2 = 'DELETE FROM orderproduct WHERE productId = @productId'
            let sqlQuery3 = 'DELETE FROM product WHERE productId = @productId'
            let result = await pool.request().input('productId', sql.VarChar, productId).query(sqlQuery);
            let result2 = await pool.request().input('productId', sql.VarChar, productId).query(sqlQuery2);
            let result3 = await pool.request().input('productId', sql.VarChar, productId).query(sqlQuery3);
    
            res.write("<h1>Deleted Product</h1>");
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