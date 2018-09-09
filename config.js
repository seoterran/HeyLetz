const test=false,

    dev_version = {
        sessionTime:{
          round0:0.2*60,
          round1:0.2*60,//sec
          round2:0.2*60,//sec
          breakTime:0.2*60//sec
        },
        test:true,
        port:3000,
        apiKey: '***',// process.env.API_KEY,
        apiSecret: '***', // process.env.API_SECRET
        dbURI: '***',//'mongodb://localhost/ConnectionTest';
        mail: {

            tweengle_email:"***",
            SENDGRID_APIKEY : "***"
        },
        ot_embed_id: '***',
        host : "localhost:3000"
    },
    prod_version = {
      sessionTime:{
        round0:1*60,
        round1:3*60,
        round2:6*60,
        breakTime:1*60
      },
      time:{ // seattle 8pm
        hour:3,
        minute:10
      },
      time2:{ //seoul 9pm
        hour:12,
        minute:10
      },
      test:false,
      port:8080,
      apiKey: '***',
      apiSecret: '***',// process.env.API_SECRET
      dbURI: '***',//'mongodb://localhost/ConnectionTest';
      mail: {
 
          tweengle_email:"***",
          SENDGRID_APIKEY : "***"
      },
      ot_embed_id: '***',
      host : "***"
    };

if(test)
    module.exports = dev_version;
else
    module.exports = prod_version;
