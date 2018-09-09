

const mongoose = require('mongoose'),
      Session = require('../models/session'),
      User = require('../models/user'),
      express = require('express'),
      router = express.Router(),
      config = require('../config'),
      email_controller = require('./emailController'),
      test = config.test,
      heyletz_email = config.mail.tweengle_email,
      S3_BUCKET =  process.env.S3_BUCKET_NAME,
      fs = require('fs'),
      folderName = "studentID",
      aws = require('aws-sdk');

//aws.config.region = 'eu-west-1';

router.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = folderName+'/'+req.query['file-name'];
  const fileType = req.query['file-type'];

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };


/*
  s3.putObject(s3Params, function(error, response) {


    console.log('uploaded file',response);
    //  console.log('uploaded file[' + fileName + '] to [' + remoteFilename + '] as [' + metaData + ']');
    //  console.log(arguments);
  });
*/

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    console.log('sign-s3',data);
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

module.exports = router;
