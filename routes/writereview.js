const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    let productId = req.query.id;
    (async function() {
        try {
            
            res.write('<!DOCTYPE html>');
            res.write('<html lang="en">');
            res.write('<head>');
            res.write('    <meta charset="UTF-8">');
            res.write('    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
            res.write('    <title style="color: green;">Write Review</title>');
            res.write('<style>');
            res.write('    body {');
            res.write('        background-color: white;');
            res.write('        display: flex;');
            res.write('        align-items: center;');
            res.write('        justify-content: center;');
            res.write('        height: 100vh;');
            res.write('        margin: 0;');
            res.write('    }');
            res.write('    .container {');
            res.write('        text-align: center;');
            res.write('    }');
            res.write('</style>');
            res.write('</head>');
            res.write('<body>');
            res.write('<div class="container">');
        
            res.write('<h2 style="color: green;">Write a Review</h2>');
            res.write('<form action="/submit-review" method="get">');
            res.write('    <input type="hidden" name="productId" value="' + productId + '">');
            res.write('    <label for="desc" style="color: green;">Enter your review:</label>');
            res.write('    <textarea id="desc" name="desc" rows="4" cols="50"></textarea><br>');
            res.write('    <input type="submit" value="Submit Review" style="background-color: green; color: white;">');
            res.write('</form>');
            res.write('</div>');
            res.write('</body>');
            res.write('</html>');
            res.end();

        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;

            