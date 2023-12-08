const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res,next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Password Updating</title>");
    let password =  req.query.password;
    let customerId = req.query.customerId;
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            let sqlQuery = 'UPDATE customer SET password = @password WHERE customerId = @customerId';
            let results = await pool.request()
                .input('password', sql.VarChar(30), password)
                .input('customerId', sql.Int, customerId)
                .query(sqlQuery);
                res.write("<h1>Password Updated: " + password + "</h1>");
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