const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res,next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Updating User</title>");
    let userid =  req.query.userid;
    let customerId = req.query.customerId;
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            let sqlQuery = 'UPDATE customer SET userid = @userid WHERE customerId = @customerId';
            let results = await pool.request()
                .input('userid', sql.VarChar(20), userid)
                .input('customerId', sql.Int, customerId)
                .query(sqlQuery);
                res.write("<h1>Username: " + userid + "</h1>");
                
                res.write("<h2><a href=\"/logout\">Please Log out</a></h2>");
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