const express = require('express');
const router = express.Router();

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
                <h1>Enter your customer id and paymentInfo to complete the transaction:</h1>
                <form method="get" action="/order">
                    <label for="customerId">Customer ID:</label>
                    <input type="text" name="customerId" size="50">
                    <label for="paymentType">Payment Type:</label>
                    <input type="text" name="paymentType" size="50">
                    <label for="paymentNumber">Payment Number:</label>
                    <input type="text" name="paymentNumber" size="50">
                    <input type="submit" value="Submit"><input type="reset" value="Reset">
                </form>
                <h2>Or, go back to your <a href="/showcart">shopping cart</a>.</h2>
            </body>
        </html>
    `);
});

module.exports = router;
