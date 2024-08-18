const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../auth');

router.get('/', function(req, res, next) {
    let authenticated = auth.checkAuthentication(req, res);
    // Stop rendering the page if we aren't authenticated
    if (!authenticated) {
        return;
    }

    let username = req.session.authenticatedUser;

    res.setHeader('Content-Type', 'text/html');

    res.write('<title>Customer Page</title>');
    res.write("<h3>Customer Profile</h3>");

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
    
            let sqlQuery = "select customerId, firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password FROM Customer WHERE userid = @username";
    
            result = await pool.request()
                .input('username', sql.VarChar, username)
                .query(sqlQuery);
    
            if (result.recordset.length === 0) {
                console.log("No user under that userId available");
                res.end();
                return;
            } else {
                let user = result.recordset[0];
                res.write(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>User Information</title>
                        <style>
                            body {font-family: Arial, sans-serif; text-align: center; margin: 20px;}
                            table {border-collapse: collapse; width: 50%; margin: 20px auto;}
                            th, td {border: 1px solid #ddd; padding: 8px; text-align: left;}
                            form {margin: 20px auto; width: 50%;}
                            label {display: block; margin-bottom: 8px;}
                            input[type="text"] {width: 100%; padding: 8px; box-sizing: border-box; margin-bottom: 16px;}
                            input[type="submit"] {background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer; font-size: 16px;}
                        </style>
                    </head>
                    <body>
                        <table>
                            <tr><th>Id</th><td>${user.customerId}</td></tr>
                            <tr><th>First Name</th><td>${user.firstName}</td></tr>
                            <tr><th>Last Name</th><td>${user.lastName}</td></tr>
                            <tr><th>Email</th><td>${user.email}</td></tr>
                            <tr><th>Phone</th><td>${user.phonenum}</td></tr>
                            <tr><th>Address</th><td>${user.address}</td></tr>
                            <tr><th>City</th><td>${user.city}</td></tr>
                            <tr><th>State</th><td>${user.state}</td></tr>
                            <tr><th>Postal Code</th><td>${user.postalCode}</td></tr>
                            <tr><th>Country</th><td>${user.country}</td></tr>
                            <tr><th>User id</th><td>${user.userid}</td></tr>
                        </table>
                        <form action="/updateuser" method="get">
                            <input type="hidden" name="customerId" value="${user.customerId}">
                            <label for="updateAddress">Update Address:</label>
                            <input type="text" id="updateAddress" name="address">
                            <input type="submit" value="Submit">
                        </form>
                        <br>
                        <form action="/updatepassword" method="get">
                            <input type="hidden" name="customerId" value="${user.customerId}">
                            <label for="updatePassword">Update Password:</label>
                            <input type="text" id="updatePassword" name="password">
                            <input type="submit" value="Submit">
                        </form>
                        <form action="/updateusername" method="get">
                            <input type="hidden" name="customerId" value="${user.customerId}">
                            <label for="updateUsername">Update UserId:</label>
                            <input type="text" id="updateUsername" name="userid">
                            <input type="submit" value="Submit">
                        </form>
                        <form action="/updatephonenum" method="get">
                            <input type="hidden" name="customerId" value="${user.customerId}">
                            <label for="updatePhoneNum">Update Phone Number:</label>
                            <input type="text" id="updatePhoneNum" name="phonenum">
                            <input type="submit" value="Submit">
                        </form>
                        <h2><a href="/">Return to Home Page</a></h2>
                    </body>
                    </html>
                    `);                    
            }
    
            res.end();
        } catch (err) {
            console.dir(err);
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Error</title>
                </head>
                <body>
                    <h1>Error</h1>
                    <p>${err}</p>
                </body>
                </html>
                `);
            res.end();
                
        }
    })();
});

module.exports = router;
