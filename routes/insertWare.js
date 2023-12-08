const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res,next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Entering Warehouse</title>");
    
    let warehouseName =  req.query.warehouseName;
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            let sqlQuery = 'INSERT INTO warehouse (warehouseName) OUTPUT INSERTED.warehouseId VALUES (@warehouseName)';
            let results = await pool.request()
                .input('warehouseName', sql.VarChar(30), warehouseName)
                .query(sqlQuery);
                res.write("<h1>Warehouse Added: " + warehouseName + "</h1>");
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