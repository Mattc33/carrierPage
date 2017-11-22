// Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var app = express(); 

// Body Parser Middleware
app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({
    extended: true
}));

// CORS Middleware
app.use(function (req, res, next) {
    // Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

// DB connection
var conn = mysql.createConnection({
    server: 'localhost',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'employee_info'
});

//Begin Listening
app.listen(5000);
console.log('server live');

/* 
QUERIES & ROUTING
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

// const
const tableName = 'employee';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Select table
getTable = function(callback) {
    conn.query('SELECT * FROM ' +tableName+ ' ', (err,rows) => {
        if (err) {
            callback(err, null);
        } else {
            var toJSON = JSON.stringify(rows);
            callback(null, toJSON);
        }
    });
}

/* Select Table Callback */
var getTableData;
getTable(function(err, content) {
    if (err) {
        console.log(err);
        return next("Mysql error, check your query");
    } else {
        getTableData = content;
    }
});

// GET Routing
app.get('/', function (req, res) {
    res.send(getTableData);
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Insert Row into Table
insertRow = function(name, phone_number, taxable) {

    conn.query("INSERT INTO " + tableName + " (name, phone_number, taxable) VALUES ('" + name + "', '" + phone_number + "', '" + taxable + "');" , (err,rows) => {
        if (err) {
            throw err
        } else {
            return;
        }
    });
};

// POST Routing
app.post('/', function(req , res){
    var name = req.body.name;
    var phone_number = req.body.phone_number;
    var taxable = req.body.taxable;

    console.log(name);
    console.log(phone_number);
    console.log(taxable);

    insertRow(name, phone_number, taxable);

    res.send(getTableData);
});