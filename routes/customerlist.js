const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');


router.get('/', function(req, res, next) {
    let authenticated = auth.checkAuthentication(req, res);
    // Stop rendering the page if we aren't authenticated
    if (!authenticated) {
        return;
    }

    let username = req.session.authenticatedUser;

    res.setHeader('Content-Type', 'text/html');

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Administrator Page</title>
                    <style>
                        body {font-family: Arial, sans-serif; text-align: center; margin: 20px;}
                        h1 {color: green;}
                        table {border-collapse: collapse; width: 80%; margin: 20px auto;}
                        th, td {border: 1px solid #ddd; padding: 8px; text-align: left;}
                        .bar-container {display: flex; align-items: baseline; height: 30px;}
                        .bar {flex: 1; height: 100%; background-color: green; margin: 0 2px;}
                    </style>
                </head>
                <body>
                `);
            res.write('<h3>Customers</h3>')
            let sqlQuery2 = "SELECT firstName,lastName FROM customer"
            let result2 = await pool.request().query(sqlQuery2);
            res.write('<table>');
            res.write('<tr><th>First Name</th><th>Last Name</th></tr>');
            for (let i = 0; i < result2.recordset.length; i++) {
                let record = result2.recordset[i];
                res.write("<tr><td>" + record.firstName + "</td><td>" + record.lastName + "</td></tr>");
            }
            res.write('</table>');
            res.write("<h2><a href=\"/admin\">Return to Admin Page</a></h2>");
            res.write('</body>');
            res.write('</html>');

            res.end();

        } catch(err) {
            console.dir(err);
            res.write(err + "");
            res.end();
        }
    })();
});

module.exports = router;