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
                body {font-family: Arial, sans-serif; text-align: center; margin: 20px;}
                h1 {color: green;}
                form {max-width: 400px; margin: 0 auto;}
                input {margin-bottom: 15px; padding: 8px; width: 100%; box-sizing: border-box;}
            </style>
        </head>
        <body>
            <h1>Warehouse Name:</h1>
            <form method="get" action="/insertWare">
                <input type="text" name="warehouseName" size="50">
                <input type="submit" value="Submit">
            </form>
        </body>
        </html>
        `); 
});
module.exports = router;