const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    //html done with help from co-pilot/chatgpt
    res.write("<title>YOUR NAME Grocery Order Processing</title>");
    res.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Information</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    margin: 20px;
                    background: linear-gradient(to bottom, #cdeccd, #2b532d);
                    color: #000;
                    transition: background 0.5s;
                }

                table {
                    border-collapse: collapse;
                    width: 50%;
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

    let paymentNumber = false;
    let custId = false;
    if (req.query.customerId && Number.isInteger(parseInt(req.query.customerId))) {
        custId = parseInt(req.query.customerId);
    } else {
        res.write("<h1>Invalid customer id.  Go back to the previous page and try again.</h1>");
        res.end();
        return;
    }
    if(Number.isInteger(parseInt(req.query.paymentNumber))){
        paymentNumber = req.query.paymentNumber;
    }else{
        res.write("<h1>Invalid payment number.  Go back to the previous page and try again.</h1>");
        res.end();
        return;
    }
    let productList = false;
    if (req.session.productList && req.session.productList.length > 0) {
        productList = req.session.productList;
    } else {
        res.write("<h1>Your shopping cart is empty!</h1>");
        res.end();
        return;
    }

    let sqlQuery = "SELECT customerId, firstName+' '+lastName as cname FROM Customer WHERE customerId = @custId";
    let orderId = false;
    let custName = false;
    let paymentType = req.query.paymentType;
    
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            let result = await pool.request()
                .input('custId', sql.Int, custId)
                .query(sqlQuery);
            custName = result.recordset[0].cname;

            let payQuery = "INSERT INTO paymentmethod (paymentType,paymentNumber) OUTPUT INSERTED.paymentMethodId VALUES(@paymentType, @paymentNumber)";
            payResult = await pool.request()
            .input('paymentType', sql.VarChar(20), paymentType)
            .input('paymentNumber', sql.VarChar(30), paymentNumber)
            .query(payQuery);
            
            let orderDate = moment().format('Y-MM-DD HH:mm:ss');
            sqlQuery = "INSERT INTO OrderSummary (customerId, totalAmount, orderDate) OUTPUT INSERTED.orderId VALUES(@custId, 0, @orderDate);"

            result = await pool.request()
                .input('custId', sql.Int, custId)
                .input('orderDate', sql.DateTime, orderDate)
                .query(sqlQuery);
            
            orderId = result.recordset[0].orderId;

            res.write("<h1>Your Order Summary</h1>");
            res.write("<table><tr><th>Product Id</th><th>Product Name</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>");

            total = 0;
            for (let i = 0; i < productList.length; i++) {
                product = productList[i];
                if (!product) {
                    continue
                }

                res.write("<tr><td>" + product.id + " </td>");
                res.write("<td>" + product.name + " </td>");
                res.write("<td align=\"center\">" + product.quantity + " </td>");
                
                price = Number(product.price).toFixed(2);
                quantity = Number(product.quantity);
				res.write("<td align=\"right\">$" + price + " </td>");
               	res.write("<td align=\"right\">$" + (price * quantity).toFixed(2) + " </td></tr>");
                res.write("</tr>");

                total = total + price * quantity;

				sqlQuery = "INSERT INTO OrderProduct VALUES(@orderId, @pid, @quantity, @price)";
                pid = parseInt(product.id);
                
                result = await pool.request()
                    .input('orderId', sql.Int, orderId)
                    .input('pid', sql.Int, pid)
                    .input('quantity', sql.Int, quantity)
                    .input('price', sql.Decimal(10,2), price)
                    .query(sqlQuery);
            }

            res.write("<tr><td colspan=\"4\" align=\"right\"><b>Order Total</b></td>\
                        <td aling=\"right\">$" + total.toFixed(2) + "</td></tr>");
            res.write("</table>");
            
            // Update order total
            console.log(total.toFixed(2));
			sqlQuery = "UPDATE OrderSummary SET totalAmount=@total WHERE orderId=@orderId";
            result = await pool.request()
                .input('total', sql.Decimal(10,2), total.toFixed(2))
                .input('orderId', sql.Int, orderId)
                .query(sqlQuery);

			res.write("<h1>Order completed.  Will be shipped soon...</h1>");
			res.write("<h1>Your order reference number is: " + orderId + "</h1>");
			res.write("<h1>Shipping to customer: " + custId + " Name: " + custName + "</h1>");
            res.write("<h1>Payment Type: " + paymentType + " Number: " + paymentNumber + "</h1>");
			res.write("<h2><a href=\"/\">Return to shopping</a></h2>");
            res.write('</body>');
                res.write('</html>');
			
			// Clear session variables (cart)
            req.session.destroy();
            
            res.end();
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
