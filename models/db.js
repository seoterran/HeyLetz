// Bring Mongoose into the app
const mongoose = require( 'mongoose' ),
    //user_controller = require('../Controllers/userController'),
      config= require('../config'),
    dbURI =config.dbURI;
mongoose.Promise = global.Promise;
// Build the connection string

// Create the database connection

var promise = mongoose.connect(dbURI, {
    useMongoClient: true
    /* other options */
});
//console.log('db.js');
var db=mongoose.connection;
// CONNECTION EVENTS
// When successfully connected
db.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
   // user_controller.find();
});

// If the connection throws an error
db.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
db.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
    process.exit(0);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    db.close(function () {
        console.log('server ended - Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

// BRING IN YOUR SCHEMAS & MODELS // For example
//require('./../model/team');
module.exports = db;
