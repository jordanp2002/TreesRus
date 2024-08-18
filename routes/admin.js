const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');
const { get } = require('./product');


router.get('/', function(req, res, next) {
    let authenticated = auth.checkAuthentication(req, res);
    // Stop rendering the page if we aren't authenticated
    if (!authenticated) {
        return;
    }

    let username = req.session.authenticatedUser;
    res.setHeader('Content-Type', 'text/html');
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
                    <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
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
                    <script
                            src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js">
                        </script>
                </body>
                </html>
                <br>
                <br>
                <br>
    `);
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            res.write('<!DOCTYPE html>');
            res.write('<html lang="en">');
            res.write('<head>');
            res.write('<meta charset="UTF-8">');
            res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
            res.write('<title>Administrator Page</title>');
            res.write('<style>');
            // Add your CSS styles here
            
          
            res.write('body {');
            res.write('  font-family: Arial, sans-serif;');
            res.write('  text-align: center;');
            res.write('  margin: 20px;');
            res.write('}');

            res.write('h1 {color: green;}');
            res.write('table {border-collapse: collapse; width: 80%; margin: 20px auto;}');
            res.write('th, td {border: 1px solid #ddd; padding: 8px; text-align: left;}');
            

            res.write('.bar-container {');
            res.write('  display: flex;');
            res.write('  align-items: center;');
            res.write('  justify-content: center;'); // Center the navigation bar
            res.write('  height: 30px;');
            res.write('}');
            res.write('.bar {');
            res.write('  flex: 1;');
            res.write('  height: 100%;');
            res.write('  background-color: green;');
            res.write('  justify-content: center;');
            res.write('  margin: 0 2px;');
            res.write('}');

            res.write('nav {');
            res.write('  background-color: green;');
            res.write('  overflow: hidden;');
            res.write('  text-align: center;');
            res.write('  width: 100%;');
            res.write('  justify-content: center;');
            res.write('}');

            res.write('nav a {');
            res.write('  display: block;'); // Display as block to stack vertically
            res.write('  color: white;');
            res.write('  text-align: center;');
            res.write('  padding: 14px 16px;');
            res.write('  text-decoration: none;');
            
            res.write('}');

            res.write('nav a:hover {');
            res.write('  background-color: white;');
            res.write('  color: black;');
            res.write('}');
            res.write('</style>');
            res.write('</head>');
            res.write('<body>');

            res.write('<h1>Admin Portal User: ' + username + '</h1>');
            
            res.write('<nav>');
            res.write('<a href="/createware">Add Warehouse</a>');
            res.write('<a href="/createuser">Add User</a>');
            res.write('<a href="/createprod">Add Product</a>');
            res.write('<a href="#" onclick="openPopup()">View Inventory</a>');
            res.write('<script>');
            res.write('function openPopup() {');
            res.write('  var warehouseId = prompt("Enter Warehouse ID:");');
            res.write('  if (warehouseId !== null) {');
            res.write('    window.location.href = "/InventoryView?warehouseId=" + warehouseId;');
            res.write('  }');
            res.write('}');
            res.write('</script>');
            res.write('<a href="#" onclick="openPopup2()">Delete Product</a>');
            res.write('<script>');
            res.write('function openPopup2() {');
            res.write('  var productName = prompt("Product you wish to delete:");');
            res.write('  if (productName !== null) {');
            res.write('    window.location.href = "/deleteProd?productName=" + productName;');
            res.write('  }');
            res.write('}');
            res.write('</script>');
            res.write('<a href="/loaddata">Restore Database</a>');
            res.write('<a href="/customerlist">Customer List</a>')
            res.write('</nav>');

            res.write('<br>');
            res.write("<h3>Administrator Sales Report by Day</h3>");
            res.write('<table>');

            let sqlQuery = "select year(orderDate) as year, month(orderDate) as month, day(orderDate) as day, SUM(totalAmount) as totalSum FROM OrderSummary GROUP BY year(orderDate), month(orderDate), day(orderDate)";
            let result = await pool.request().query(sqlQuery);
            let years = [];
            let totalSums = [];
            let months = [];
            res.write('<table>');
            res.write('<tr><th>Order Date</th><th>Total Order Amount</th></tr>');    
            for (let i = 0; i < result.recordset.length; i++) {
                let record = result.recordset[i];
                years.push(record.year);
                totalSums.push(record.totalSum);
                months.push(record.month);
                res.write("<tr><td>" + record.year + "-" + record.month + "-" + record.day + "</td><td>$" + record.totalSum.toFixed(2) + "</td></tr>");
                
            }
            let chartData = await getChartData(months, totalSums);
            res.write('</table>');
            res.write('<div style="display: flex; justify-content: center; align-items: center; height: 80vh;">');
            res.write('<canvas id="myChart" style="width:100%;max-width:700px">');
            res.write('</canvas>');
            res.write('<script>');
            res.write('var ctx = document.getElementById("myChart").getContext("2d");');
            res.write('var myChart = new Chart(ctx, {');
            res.write('  type: "bar",');
            res.write('  data: {');
            res.write('    labels: ' + JSON.stringify(chartData.labels) + ',');
            res.write('    datasets: [{');
            res.write('      label: "Total Order Amount",');
            res.write('      data: ' + JSON.stringify(chartData.data) + ',');
            res.write('      backgroundColor: "rgba(75, 192, 192, 0.2)",');
            res.write('      borderColor: "rgba(75, 192, 192, 1)",');
            res.write('      borderWidth: 1');
            res.write('    }]');
            res.write('  },');
            res.write('  options: {');
            res.write('    scales: {');
            res.write('      y: {');
            res.write('        beginAtZero: true');
            res.write('      }');
            res.write('    }');
            res.write('  }');
            res.write('});');
            res.write('</script>');
            res.write('</div>');
            res.write('</body>');
            res.write('</html>');
            res.end();

        } catch(err) {
            console.dir(err);
            res.write(err + "");
            res.end();
        }
    })();
    async function getChartData(months, totalSums) {
        return { labels: months, data: totalSums };
      }
    
});


module.exports = router;