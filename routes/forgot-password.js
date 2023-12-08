const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res,next) {
    //html coded with help of co-pilot/chatgpt
    res.setHeader('Content-Type', 'text/html');
    res.write("<!DOCTYPE html>");
    res.write("<html lang='en'>");
    res.write("<head>");
    res.write("<meta charset='UTF-8'>");
    res.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
    res.write("<title>Forgot Password</title>");
    res.write("<style>");
    
    res.write("body { font-family: Arial, sans-serif; text-align: center; margin: 20px; background-color: #f4f4f4; }");
    res.write("h1 { color: green; }");
    res.write("form { margin: 0 auto; text-align: center; display: inline-block; padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 5px; }");
    res.write("input { padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 3px; }");
    res.write(".submit { background-color: green; color: white; cursor: pointer; }");
    res.write(".submit:hover { background-color: #4CAF50; }");
    res.write("</style>");
    res.write("</head>");
    res.write("<body>");
    let email =  req.query.email;
    let username = req.query.username;
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            let sqlQuery = 'SELECT password FROM customer WHERE email = @email AND userid = @username';
            let results = await pool.request()
                .input('email', sql.VarChar(50), email)
                .input('username', sql.VarChar(50), username)
                .query(sqlQuery);
                res.write("<h1>Your Password:  " + results.recordset[0].password + "</h1>");
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