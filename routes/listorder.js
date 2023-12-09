const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    //html done with help from co-pilot/chatgpt
    res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Your Tree Emporium</title>
                    
                    <!-- Bootstrap CSS via CDN -->
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                        crossorigin="anonymous">
                </head>
                <body>
                    <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-gray">
                        <div class="container-fluid">
                            <a class="navbar-brand mb-0 h1">Your Tree Emporium</a>
                            <div class="navbar" id="navbarText">
                                <div class="navbar-nav ml-auto">
                                    <a class="nav-link active" aria-current="page" href="/">Home</a>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <!-- Bootstrap JavaScript and Popper.js via CDN -->
                    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
                            integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
                            crossorigin="anonymous"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
                            integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
                            crossorigin="anonymous"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
                            integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
                            crossorigin="anonymous"></script>
                </body>
                </html>
                <br>
                <br>
                <br>
    `);
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            //html coded with help of copilot/chatgpt
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Your Tree Emporium Order List</title>
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
            `);

    
            let sqlQuery = "SELECT orderId, O.CustomerId, totalAmount, firstName+' '+lastName as cname, orderDate FROM OrderSummary O, Customer C WHERE O.customerId = C.customerId";
            let result = await pool.request().query(sqlQuery);
    
            res.write("<h1>Order List</h1>");
            res.write('<table><tr><th>Order Id</th><th>Order Date</th><th>Customer Id</th><th>Customer Name</th><th>Total Amount</th></tr>');
    
            for (let i = 0; i < result.recordset.length; i++) {
                let record = result.recordset[i];
                orderId = record.orderId;
                orderDate = new Date(record.orderDate);
                res.write("<tr><td>" + orderId + "</td>");
                res.write("<td>" + moment(orderDate).format('Y-MM-DD HH:mm:ss') + "</td>");
                res.write("<td>" + record.CustomerId + "</td>");
                res.write("<td>" + record.cname + "</td>");
                res.write("<td>$" + record.totalAmount.toFixed(2) + "</td>");
                res.write("</tr>");
    
                let orderedProducts = await pool.request()
                    .input('id', sql.Int, orderId)
                    .query('SELECT productId, quantity, price FROM OrderProduct WHERE orderId=@id')
    
                res.write("<tr align=\"right\"><td colspan=\"5\"><table>");
                res.write("<th>Product Id</th><th>Quantity</th><th>Price</th></tr>");
                for (let j = 0; j < orderedProducts.recordset.length; j++) {
                    let product = orderedProducts.recordset[j];
                    res.write("<tr><td>" + product.productId + "</td>");
                    res.write("<td>" + product.quantity + "</td>");
                    res.write("<td>$" + product.price.toFixed(2) + "</td></tr>");
                }
                res.write("</table></td></tr>");
            }
    
            res.write("</table>");
            res.write('</body>');
            res.write('</html>');
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
            res.write('<h3>Has the data been loaded?</h3>');
            res.write('</body>');
            res.write('</html>');
            res.end();
        }
    })();
});

module.exports = router;
