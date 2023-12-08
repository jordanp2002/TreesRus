const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res,next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Entering Product</title>");
    let productName =  req.query.productName;
    let productPrice = req.query.productPrice;
    let productDesc = req.query.productDescription;
    let categoryId = req.query.categoryId;
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            let sqlQuery = 'INSERT INTO product (productName,productPrice,productDesc,categoryId) OUTPUT INSERTED.productId VALUES (@productName,@productPrice,@productDesc,@categoryId)';
            let results = await pool.request()
                .input('productName', sql.VarChar(40), productName)
                .input('productPrice', sql.Decimal(10,2), productPrice)
                .input('productDesc', sql.VarChar(40), productDesc)
                .input('categoryId', sql.Int, categoryId)
                .query(sqlQuery);
                res.write("<h1>Product Added</h1>");
                res.write("<h2><a href=\"/admin\">Return to Admin Page</a></h2>");
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