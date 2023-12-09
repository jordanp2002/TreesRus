const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res,next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Entering Customer</title>");
    
    let password = req.query.password;
    let email = false;
    let address = req.query.address;
    let phone = false;
    let firstname = req.query.firstName;
    let lastname = req.query.lastName;
    let postalCode = req.query.postalCode
    let city = req.query.city;
    let state = req.query.state;
    let country = req.query.country;
    let userid = req.query.userid;
    if (Number.isInteger(parseInt(req.query.phonenum))) {
        phone = req.query.phonenum;
    }else{
        res.write("<h1>Invalid phone number.  Go back to the previous page and try again.</h1>");
        res.end();
        return;
    }
    if((req.query.email).includes("@")){
        email = req.query.email;
    }else{
        res.write("<h1>Invalid email.  Go back to the previous page and try again.</h1>");
        res.end();
        return;
    }

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            let sqlQuery = 'INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) OUTPUT INSERTED.customerId VALUES (@firstName, @lastName, @email, @phonenum, @address, @city, @state, @postalCode, @country, @userid, @password)';
            let results = await pool.request()
                .input('firstName', sql.VarChar(40), firstname)
                .input('lastName', sql.VarChar(40), lastname)
                .input('email', sql.VarChar(50), email)
                .input('phonenum', sql.VarChar(20), phone)
                .input('address', sql.VarChar(50), address)
                .input('city', sql.VarChar(40), city)
                .input('state', sql.VarChar(20), state)
                .input('postalCode', sql.VarChar(20), postalCode)
                .input('country', sql.VarChar(40), country)
                .input('userid', sql.VarChar(20), userid)
                .input('password', sql.VarChar(30), password)
                .query(sqlQuery);
                let customerId = results.recordset[0].customerId;
                res.write("<h2>Customer Added: (Please Remember Id)" +customerId + "</h2>");
                res.write("<h2><a href=\"/\">Return Home</a></h2>");
                res.end();
            return true;
        } catch (err) {
            console.dir(err);
            res.write(err.toString());
            return false;
        }
        })();
        
        
});

module.exports = router;
