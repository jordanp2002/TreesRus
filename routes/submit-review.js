const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res,next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Submitting review</title>");
    let reviewDesc = req.query.desc;
    let productId = req.query.productId;
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            let sqlQuery = 'INSERT INTO productreview (reviewDesc,productId) VALUES (@reviewDesc,@productId)';
            let results = await pool.request()
                .input('reviewDesc', sql.VarChar(2000), reviewDesc)
                .input('productId', sql.Int, productId)
                .query(sqlQuery);
                res.write("<h1>Review Submited: " + reviewDesc + "</h1>");
                res.write("<h2><a href=\"/product?id=" + productId +"\"> Return to product</a></h2>");
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