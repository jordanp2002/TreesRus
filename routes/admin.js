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
            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Administrator Page</title>
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
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                        }
                        .bar-container {
                            display: flex;
                            align-items: center;
                            justify-content: center; /* Center the navigation bar */
                            height: 30px;
                        }
                        .bar {
                            flex: 1;
                            height: 100%;
                            background-color: green;
                            justify-content: center;
                            margin: 0 2px;
                        }
                        nav {
                            background-color: green;
                            overflow: hidden;
                            text-align: center;
                            width: 100%;
                            justify-content: center;
                        }
                        nav a {
                            display: block; /* Display as block to stack vertically */
                            color: white;
                            text-align: center;
                            padding: 14px 16px;
                            text-decoration: none;
                        }
                        nav a:hover {
                            background-color: white;
                            color: black;
                        }
                    </style>
                </head>
                <body>
                    <h1>Admin Portal User: ${username}</h1>
                    <nav>
                        <a href="/createware">Add Warehouse</a>
                        <a href="/createuser">Add User</a>
                        <a href="/createprod">Add Product</a>
                        <a href="#" onclick="openPopup()">View Inventory</a>
                        <script>
                            function openPopup() {
                                var warehouseId = prompt("Enter Warehouse ID:");
                                if (warehouseId !== null) {
                                    window.location.href = "/InventoryView?warehouseId=" + warehouseId;
                                }
                            }
                        </script>
                        <a href="#" onclick="openPopup2()">Delete Product</a>
                        <script>
                            function openPopup2() {
                                var productName = prompt("Product you wish to delete:");
                                if (productName !== null) {
                                    window.location.href = "/deleteProd?productName=" + productName;
                                }
                            }
                        </script>
                        <a href="/loaddata">Restore Database</a>
                        <a href="/customerlist">Customer List</a>
                    </nav>
                    <br>
                    <h3>Administrator Sales Report by Day</h3>
                    <table>
                `);                
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
            res.write(`
                </table>
                <div style="display: flex; justify-content: center; align-items: center; height: 80vh;">
                    <canvas id="myChart" style="width:100%;max-width:700px"></canvas>
                    <script>
                        var ctx = document.getElementById("myChart").getContext("2d");
                        var myChart = new Chart(ctx, {
                            type: "bar",
                            data: {
                                labels: ${JSON.stringify(chartData.labels)},
                                datasets: [{
                                    label: "Total Order Amount",
                                    data: ${JSON.stringify(chartData.data)},
                                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                                    borderColor: "rgba(75, 192, 192, 1)",
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });
                    </script>
                </div>
                </body>
                </html>
                `);                
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