const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    let productId = req.query.id;
    (async function() {
        try {
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title style="color: green;">Write Review</title>
                    <style>
                        body {
                            background-color: white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                        }
                        .container {
                            text-align: center;
                        }
                        h2 {
                            color: green;
                        }
                        label {
                            color: green;
                        }
                        input[type="submit"] {
                            background-color: green;
                            color: white;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Write a Review</h2>
                        <form action="/submit-review" method="get">
                            <input type="hidden" name="productId" value="${productId}">
                            <label for="desc">Enter your review:</label>
                            <textarea id="desc" name="desc" rows="4" cols="50"></textarea><br>
                            <input type="submit" value="Submit Review">
                        </form>
                    </div>
                </body>
                </html>
                `);                
            res.end();

        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;

            