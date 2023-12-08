const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res,next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Updating User</title>");
    let address =  req.query.address;
    let customerId = req.query.customerId;
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            let sqlQuery = 'UPDATE customer SET address = @address WHERE customerId = @customerId';
            let results = await pool.request()
                .input('address', sql.VarChar(50), address)
                .input('customerId', sql.Int, customerId)
                .query(sqlQuery);
                res.write("<h1>Address Updated: " + address + "</h1>");
                res.write("<h2><a href=\"/customer\">Return to Customer Page</a></h2>");
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