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
                //html coded with help from co-pilot/chatgpt
                let user = result.recordset[0];
                res.write('<!DOCTYPE html>');
                res.write('<html lang="en">');
                res.write('<head>');
                res.write('<meta charset="UTF-8">');
                res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
                res.write('<title>User Information</title>');
                res.write('<style>');
               
                res.write('body {font-family: Arial, sans-serif; text-align: center; margin: 20px;}');
                res.write('table {border-collapse: collapse; width: 50%; margin: 20px auto;}');
                res.write('th, td {border: 1px solid #ddd; padding: 8px; text-align: left;}');
                res.write('form {margin: 20px auto; width: 50%;}');
                res.write('label {display: block; margin-bottom: 8px;}');
                res.write('input[type="text"] {width: 100%; padding: 8px; box-sizing: border-box; margin-bottom: 16px;}');
                res.write('input[type="submit"] {background-color: green; color: white; padding: 10px 20px; border: none; cursor: pointer; font-size: 16px;}');
                res.write('</style>');
                res.write('</head>');
                res.write('<body>');
    
                res.write('<table>');
                res.write('<tr><th>Id</th><td>' + user.customerId + '</td></tr>');
                res.write('<tr><th>First Name</th><td>' + user.firstName + '</td></tr>');
                res.write('<tr><th>Last Name</th><td>' + user.lastName + '</td></tr>');
                res.write('<tr><th>Email</th><td>' + user.email + '</td></tr>');
                res.write('<tr><th>Phone</th><td>' + user.phonenum + '</td></tr>');
                res.write('<tr><th>Address</th><td>' + user.address + '</td></tr>');
                res.write('<tr><th>City</th><td>' + user.city + '</td></tr>');
                res.write('<tr><th>State</th><td>' + user.state + '</td></tr>');
                res.write('<tr><th>Postal Code</th><td>' + user.postalCode + '</td></tr>');
                res.write('<tr><th>Country</th><td>' + user.country + '</td></tr>');
                res.write('<tr><th>User id</th><td>' + user.userid + '</td></tr>');
                res.write('</table>');
                res.write('<form action="/updateuser" method="get">');
                res.write('<input type="hidden" name="customerId" value="' +user.customerId + '">');
                res.write('<label for="updateText">Update Address:</label>');
                res.write('<input type="text" id="updateAddress" name="address">');
                res.write('<input type="submit" value="Submit">');
                res.write('</form>');
                res.write('</br>');
                res.write('<form action="/updatepassword" method="get">');
                res.write('<input type="hidden" name="customerId" value="' +user.customerId + '">');
                res.write('<label for="updateText">Update Password:</label>');
                res.write('<input type="text" id="updatepassword" name="password">');
                res.write('<input type="submit" value="Submit">');
                res.write('</form>');
                res.write('<form action="/updateusername" method="get">');
                res.write('<input type="hidden" name="customerId" value="' +user.customerId + '">');
                res.write('<label for="updateText">Update UserId: </label>');
                res.write('<input type="text" id="userid" name="userid">');
                res.write('<input type="submit" value="Submit">');
                res.write('</form>');
                res.write('<form action="/updatephonenum" method="get">');
                res.write('<input type="hidden" name="customerId" value="' +user.customerId + '">');
                res.write('<label for="updateText">Update Phone Number:</label>');
                res.write('<input type="text" id="phonenum" name="phonenum">');
                res.write('<input type="submit" value="Submit">');
                res.write('</form>');
                res.write('</form>');
                res.write("<h2><a href=\"/\">Return to Home Page</a></h2>");
                res.write('</body>');
                res.write('</html>');
                
            }
    
            res.end();
        } catch (err) {
            console.dir(err);
            res.write('<!DOCTYPE html>');
            res.write('<html lang="en">');
            res.write('<head>');
            res.write('<meta charset="UTF-8">');
            res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
            res.write('<title>Error</title>');
            res.write('</head>');
            res.write('<body>');
            res.write('<h1>Error</h1>');
            res.write('<p>' + err + '</p>');
            res.write('</body>');
            res.write('</html>');
            res.end();
        }
    })();
});

module.exports = router;
