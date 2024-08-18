const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res,next) {
    res.setHeader('Content-Type', 'text/html');
    res.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Forgot Password</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin: 20px; background-color: #f4f4f4; }
                h1 { color: green; }
                form { margin: 0 auto; text-align: center; display: inline-block; padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 5px; }
                input { padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 3px; }
                .submit { background-color: green; color: white; cursor: pointer; }
                .submit:hover { background-color: #4CAF50; }
            </style>
        </head>
        <body>
        `);        
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