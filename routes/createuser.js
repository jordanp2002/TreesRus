const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Grocery CheckOut Line</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    margin: 20px;
                    background: linear-gradient(to bottom, #cdeccd, #2b532d);
                    color: #000;
                    transition: background 0.5s;
                }

                h1 {
                    color: green;
                }

                form {
                    max-width: 400px;
                    margin: 0 auto;
                }

                input {
                    margin-bottom: 15px;
                    padding: 8px;
                    width: 100%;
                    box-sizing: border-box;
                }
            </style>
        </head>
        <body>
    `);


    res.write('<h1>Create User: </h1>');

    res.write('<form method="get" action="/InsertUser">');
    
    res.write(`


    <label for="firstName">First Name:</label>
    <input type="text" id="firstName" name="firstName" required>

    <label for="lastName">Last Name:</label>
    <input type="text" id="lastName" name="lastName" required>

    <label for="email">Email:</label>
    <input type="text" id="email" name="email" required>

    <label for="phonenum">Phone Number:</label>
    <input type="text" id="phonenum" name="phonenum" required>

    <label for="address">Address:</label>
    <input type="text" id="address" name="address" required>

    <label for="city">City:</label>
    <input type="text" id="city" name="city" required>

    <label for="state">State:</label>
    <input type="text" id="state" name="state" required>

    <label for="postalCode">Postal Code:</label>
    <input type="text" id="postalCode" name="postalCode" required>

    <label for="country">Country:</label>
    <input type="text" id="country" name="country" required>

    <label for="userid">User ID:</label>
    <input type="text" id="userid" name="userid" required>

    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required>
`);

    res.write('<input type="submit" value="Submit">');
    res.write('</form>');

    res.write('</body>');
    res.write('</html>');
});

module.exports = router;
