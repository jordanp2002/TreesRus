const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            res.write(`
            <title>YOUR NAME Grocery - Product Information</title>
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
        

            let sqlQuery = "SELECT productId, productName, productPrice, productImageURL, productImage,productDesc FROM Product P  WHERE productId = @id";
            let productId = req.query.id;

            let reviewQuery = "SELECT reviewDesc FROM productreview WHERE productId = @id";
            let reviewResult = await pool.request().input('id', sql.Int, productId).query(reviewQuery);
            let review = reviewResult.recordset[1];

            if (productId === undefined || productId === "") {
                res.write("Invalid product");
                res.end();
                return;
            }

            result = await pool.request()
                .input('id', sql.Int, productId)
                .query(sqlQuery);

            if (result.recordset.length === 0) {
                res.write("Invalid product");
            } else {
                let product = result.recordset[0];

                res.write("<h2>" + product.productName + "</h2>");
		
                res.write("<table><tr>");
                res.write("<th>Id</th><td>" + product.productId + "</td></tr>"				
                        + "<tr><th>Price</th><td>$" + product.productPrice.toFixed(2) + "</td></tr>"
                        + "<tr><th>Description</th><td>" + product.productDesc + "</td></tr>");
                
                //  Retrieve any image with a URL
                imageLoc = product.productImageURL;
                if (imageLoc != null)
                    res.write("<img src=\"" + imageLoc + "\" style=\"width:30%;\">");
                
                // Retrieve any image stored directly in database
                imageBinary = product.productImage;
                if (imageBinary != null)
                    res.write("<img src=\"displayImage?id=" + product.productId + "\" style=\"width:30%;\">");	
                res.write("</table>");
                

                res.write("<h3><a href=\"addcart?id=" + product.productId + "&name=" + product.productName
                                        + "&price=" + product.productPrice + "\">Add to Cart</a></h3>");	
                if (reviewResult.recordset.length > 0) {
                    res.write("<h3>Product Reviews</h3>");
                    res.write("<table>");
                    res.write("<tr><th>Review Description</th></tr>");
                        
                    for (let i = 0; i < reviewResult.recordset.length; i++) {
                        res.write("<tr>");
                        res.write("<td>" + reviewResult.recordset[i].reviewDesc + "</td>");
                        res.write("</tr>");
                        }
                    res.write("</table>");
                    }
                res.write("<h3><a href=\"listprod\">Continue Shopping</a>");
                res.write("<h3><a href=\"writereview?id="+ product.productId +"\">Write Review</a>");
            }
            res.write('</body>');
            res.write('</html>');
            res.end()
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
