const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    //html coded with help from co-pilot/chatgpt
    res.write('<!DOCTYPE html>');
    res.write('<html lang="en">');
    res.write('<head>');
    res.write('<meta charset="UTF-8">');
    res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    res.write('<title>Grocery CheckOut Line</title>');
    res.write('<style>');
   
    res.write('body {font-family: Arial, sans-serif; text-align: center; margin: 20px;}');
    res.write('h1 {color: green;}');
    res.write('form {max-width: 400px; margin: 0 auto;}');
    res.write('input {margin-bottom: 15px; padding: 8px; width: 100%; box-sizing: border-box;}');
    res.write('</style>');
    res.write('</head>');
    res.write('<body>');

    res.write('<h1>Warehouse Name:</h1>');

    res.write('<form method="get" action="/insertWare">');
    
    res.write('<input type="text" name="warehouseName" size="50">');
    res.write('<input type="submit" value="Submit">');
    res.write('</form>');
    res.write('</body>');
    res.write('</html>');
});
module.exports = router;