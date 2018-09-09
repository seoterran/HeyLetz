const mongoose = require('mongoose'),
      Report = require('../models/report'),
      config = require('../config'),
      express = require('express'),
      router = express.Router(),
      test = config.test;

router.post('/', function(req, res) {

    var input= req.body;
  //  console.log('report:',input);
    Report.create(input, function (err, small) {
        if (err) return handleError(err);
        console.log('A report created');
        var data={
            to : small.reporter.userId
        };
        res.send(data);
    });
});

module.exports = router;
