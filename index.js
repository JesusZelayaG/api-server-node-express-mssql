//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
var server = app.listen(process.env.PORT || 8899, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

//Initiallising connection string
var dbConfig = {
    user: 'diconnect',
    password: 'DI@t%y^u&',
    server: '172.10.75.80', //DBTC or 172.10.75.78 
    //DBTC3 or 172.10.75.80 
    database: 'TestDB',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

var pool = new sql.ConnectionPool(dbConfig)
pool.connect(err => {
    if(err) console.log("Error while connecting database :- " + err);
    else
    console.log("Connected to database");
    //res.send(err);
})

//Function to connect to database and execute query
var executeQuery = function (res, query) {

    var request = new sql.Request(pool);
    // query to the database
    request.query(query, function (err, result) {
        if (err) {
            console.log("Error while querying database :- " + err);
            res.send(err);
        }
        else {
            res.send(result.recordsets);
        }
    });
}

//Function to connect to database and execute query
var executeNonQuery = function (res, query) {

    var request = new sql.Request(pool);
    // query to the database
    request.query(query, function (err, result) {
        if (err) {
            console.log("Error while querying database :- " + err);
            res.send(err);
        }
        else {
            res.send('Rows Affected: ' + result.rowsAffected);
        }
    });
}


//GET API
app.get("/api/customer", function (req, res) {
    var query = "select * from [Customer]";
    executeQuery(res, query);
});

//POST API
app.post("/api/customer", function (req, res) {
    var query = `INSERT INTO [Customer] (ID, NAME,Phone) VALUES (NEWID(), '${req.body.name}','${req.body.phone}')`;
    executeNonQuery(res, query);
});

//PUT API
app.put("/api/customer/:id", function (req, res) {
    var query = `UPDATE [Customer] SET NAME= '${req.body.name}', Phone='${req.body.phone}' WHERE ID='${req.params.id}'`;
    executeNonQuery(res, query);
});

// DELETE API
app.delete("/api/customer/:id", function (req, res) {
    var query = `DELETE FROM [Customer] WHERE Id='${req.params.id}'`;
    executeNonQuery(res, query);
});