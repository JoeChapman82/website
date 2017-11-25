if(process.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Include the cluster module
var cluster = require('cluster');
// Code to run if we're in the master process
if (cluster.isMaster) {
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    // Listen for terminating workers
    cluster.on('exit', function (worker) {
        // Replace the terminated workers
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });
// Code to run if we're in a worker process
} else {
    const bootstrap = require('./app/middleware/bootstrap');
    var AWS = require('aws-sdk');
    var express = require('express');
    AWS.config.region = process.env.REGION;
    var app = express();
    bootstrap(app);

    // var sns = new AWS.SNS();
    // var ddb = new AWS.DynamoDB();
    app.get('/', function(req, res) {
        res.render('index');
    });

    var port = process.env.PORT || 3000;

    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
}
