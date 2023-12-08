const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

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
                    <style>
                        body {
                            background: linear-gradient(to bottom, #cdeccd, #2b532d);
                            color: #000;
                            transition: background 0.5s;
                        }
                    </style>
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

            //html coded with assisant of copilot/chatgpt
            res.write(`
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Your Tree Emporium</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            margin: 20px;
                        }
                        h1 {
                            color: green;
                        }
                        form {
                            margin-top: 20px;
                        }
                        select, input[type="text"], input[type="submit"], input[type="reset"] {
                            margin: 5px;
                        }
                    </style>
                </head>
                <body>
                    <h1>Search for trees you want to buy:</h1>
                    <form method="get" action="listprod">
                        <label for="categoryName">Category:</label>
                        <select id="categoryName" name="categoryName">
                            <option>All</option>
                            <option>Regular Trees</option>
                            <option>Evergreen Trees</option>
                            <option>Fruit Trees</option>
                            <option>Special Trees</option>
                        </select>
                        <label for="productName">Product Name:</label>
                        <input type="text" id="productName" name="productName" size="50">
                        <input type="submit" value="Submit">
                        <input type="reset" value="Reset"> (Leave Blank for all products)
                    </form>
                </body>
                </html>
            `);
        
            
            let sqlQuery = false;
            let filter = false;
            let name = req.query.productName;
            let category = req.query.categoryName;
            
            // Truthy conversion for parameters
            let hasNameParam = name !== undefined && name !== "";
            let hasCategoryParam = category !== undefined && category !== "" && category.toUpperCase() !== "ALL";
            let products = false;
            
            if (hasNameParam && hasCategoryParam) {
                filter = "<h2>Products containing '" + name + "' in category: '" + category + "'</h2>";
                name = '%' + name + '%';
                sqlQuery = "SELECT productId, productName, productPrice, categoryName FROM Product P JOIN Category C ON P.categoryId = C.categoryId WHERE productName LIKE @name AND categoryName = @category";
            } else if (hasNameParam) {
                filter = "<h2>Products containing '" + name + "'</h2>";
                name = '%' + name + '%';
                sqlQuery = "SELECT productId, productName, productPrice, categoryName FROM Product P JOIN Category C ON P.categoryId = C.categoryId WHERE productName LIKE @name";
            } else if (hasCategoryParam) {
                filter = "<h2>Products in category: '" + category + "'</h2>";
                sqlQuery = "SELECT productId, productName, productPrice, categoryName FROM Product P JOIN Category C ON P.categoryId = C.categoryId WHERE categoryName = @category";
            } else {
                filter = "<h2>All Products</h2>";
                sqlQuery = "SELECT productId, productName, productPrice, categoryName FROM Product P JOIN Category C ON P.categoryId = C.categoryId";
            }

            res.write(filter);
            
            if (hasNameParam) {
                if (hasCategoryParam) {
                    products = await pool.request()
                        .input('name', sql.VarChar, name)
                        .input('category', sql.VarChar, category)
                        .query(sqlQuery);
                } else {
                    products = await pool.request()
                        .input('name', sql.VarChar, name)
                        .query(sqlQuery);
                }
            } else if (hasCategoryParam) {
                products = await pool.request()
                    .input('category', sql.VarChar, category)
                    .query(sqlQuery);
            } else {
                products = await pool.request()
                    .query(sqlQuery);
            }
            res.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your Tree Emporium</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        margin: 20px;
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
                    <table>
                        <tr>
                            <th></th>
                            <th>Product Name</th>
                            <th>Price</th>
                        </tr>
            `);

            for (let i = 0; i < products.recordset.length; i++) {
                let product = products.recordset[i];
                res.write('<tr>');
                res.write('<td><a href="addcart?id=' + product.productId + '&name=' + product.productName + '&price=' + product.productPrice.toFixed(2) + '">Add to Cart</a></td>');
                res.write('<td><a href="product?id=' + product.productId + '">' + product.productName + '</a></td>');
                res.write('<td>$' + product.productPrice.toFixed(2) + '</td>');
                res.write('</tr>');
            }
            res.write("</table>");
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
