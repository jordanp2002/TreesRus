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
            <form method="get" action="/insertprod">
                <label for="productName">Name: </label>
                <input type="text" id="productName" name="productName" required>
                <label for="productPrice">Price: </label>
                <input type="text" id="productPrice" name="productPrice" required> 
                <label for="productDescription">Description: </label>
                <input type="text" id="productDescription" name="productDescription" required>
                <label for="categoryId">Category Id: </label>
                <input type="text" id="categoryId" name="categoryId" required>
                <input type="submit" value="Create Product">
            </form>
        </body>
        </html>
        `);        
});

module.exports = router;