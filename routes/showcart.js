const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    let productList = false;
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Your Shopping Cart</title>");
    //html done with help from co-pilot/chatgpt
    if (req.session.productList) {
        productList = req.session.productList;
        res.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Shopping Cart</title>
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
    
                table {
                    border-collapse: collapse;
                    width: 80%;
                    margin: 20px auto;
                    border: 1px solid gray;
                }
    
                th, td {
                    border: 1px solid gray;
                    padding: 8px;
                    text-align: left;
                }
            </style>
        </head>
        <body>
        <h1>Your Shopping Cart</h1>
        <table>
        <form action="/updateQuantity" method="get">
        <tr><th>Product Id</th><th>Product Name</th><th>Quantity</th>
        <th>Price</th><th>Subtotal</th></tr>
    `);
    
        let total = 0;
        for (let i = 0; i < productList.length; i++) {
            product = productList[i];
            if (!product) {
                continue
            }

            res.write('<tr>');
            res.write('<td>' + product.id + '</td>');
            res.write('<td>' + product.name + '</td>');
            res.write('<td><input type="number" name="quantity-' + product.id + '" value="' + product.quantity + '" min="1"></td>');
            res.write('<td align="right">$' + Number(product.price).toFixed(2) + '</td>');
            res.write('<td align="right">$' + (Number(product.quantity) * Number(product.price)).toFixed(2) + '</td>');
            res.write('<td><a href="/removecart?productId=' + product.id + '">Remove</a></td>');
            res.write('</tr>');
            total = total + product.quantity * product.price;
        }
        res.write('<tr><td colspan="4" align="right"><b>Order Total</b></td><td align="right">$' + total.toFixed(2) + '</td></tr>');
        res.write('</table>');
        res.write('<input type="submit" value="Update Quantities">');
        res.write("<h2><a href=\"checkout\">Check Out</a></h2>");
    } else{
        res.write("<h1>Your shopping cart is empty!</h1>");
    }
    res.write('</body>');
    res.write('</html>');
    res.write('<h2><a href="listprod">Continue Shopping</a></h2>');

    res.end();
});

module.exports = router;
