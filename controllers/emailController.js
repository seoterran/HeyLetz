const mongoose = require('mongoose'),
      Session = require('../models/session'),
      User = require('../models/user'),
      config = require('../config'),
      sendgrid = require("@sendgrid/mail"),
      request = require('request'),
      test = config.test;

sendgrid.setApiKey(config.mail.SENDGRID_APIKEY);//process.env.SENDGRID_API_KEY);

module.exports.send = function(msg,delay) {
    /*
    email.addTo(mailOptions.to);
    email.setFrom(mailOptions.from);
    email.setSubject(mailOptions.subject);
    email.setHtml(mailOptions.html);
    email.setText(mailOptions.text);
    */

   // sendgrid.send(msg);
   var newDate = new Date();

   var time=Math.round(Date.now() / 1000);
   newDate.setTime(time*1000);
   var dateString = newDate.toUTCString();

   var timestamp= Number(time+ delay*3600);
   newDate.setTime(timestamp*1000);
   var dateString2 = newDate.toUTCString();
 //var email=new sendgrid.send(msg);
 //email.setSendAt( timestamp);
 //return;
/*
   var date = new Date(timestamp * 1000);
   var datevalues = {
       date.getFullYear(),
       date.getMonth()+1,
       date.getDate(),
       date.getHours(),
       date.getMinutes(),
       date.getSeconds(),
    };*/
    var options = {
      method: 'POST',
      url: 'https://api.sendgrid.com/v3/mail/send',
      headers: {
         'content-type': 'application/json',
         authorization: 'Bearer '+config.mail.SENDGRID_APIKEY
       },
      body: {
         personalizations: [ {
            to: [ {
              email:  msg.to,
            //  name: 'John Doe'
            } ],
            subject: '[HeyLetz] '+msg.subject,
            send_at: timestamp
          } ],
          from: {
              email: msg.from,
            //  name: 'Sam Smith'
          },
          reply_to: {
              email: msg.from
          //    name: 'Sam Smith'
            },
          //  timezone: "America/Los_Angeles",
            content: [ {
              type: 'text/html',
              value: msg.html || msg.text
            } ]
        },
        json: true
      };

   request(options, function (error, response, body) {
       if (error) throw new Error(error);
       console.log('email will be sent at',delay,timestamp,dateString2,msg.from,msg.to);
    //   if (!error && response.statusCode == 200)
      //     console.log('email sent',body);

  });

    /*
    var input= {
        personalizations: {
            to:{
                email: msg.to
            },
            subject: msg.subject
        },
        from: {
             email: msg.from
        },
        content: {
            type: "text/plain",
            value: msg.text
        }
    };
    input={
        "personalizations": [
            {
                "to": [
                    {
                        "email": msg.to,
                        "name": "John Doe"
                    }
                ],
                "subject": "Hello, World!"
            }
        ],
        "from": {
            "email": msg.from,
            "name": "Sam Smith"
        },

        "reply_to": {
            "email": "sam.smith@example.com",
            "name": "Sam Smith"
        },
        "subject": "Hello, World!",
        "content": [
            {
                "type": "text/html",
                "value": "<html><p>Hello, world!</p></html>"
            }
        ]
    };

    console.log(' sending email!',input,config.mail.SENDGRID_APIKEY);
    request.post({
            headers: "Authorization: Bearer " + config.mail.SENDGRID_APIKEY,
            url: 'https://api.sendgrid.com/v3/mail/send',
            json: input
        },
        function (error, response, body) {

            if (!error && response.statusCode == 200) {
                console.log('email sent',body);
            } else
                console.log('email error',error,body);
        }
    );
    */
}
