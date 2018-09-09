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
        apiKey: '46143052',//'45933082', // process.env.API_KEY,
        apiSecret: '4464230683e5856b0c161dfbbd120fa761dc9324',//'4df52d6baab53c2a93be8b5f18d243a9dc8c2905', // process.env.API_SECRET
        dbURI: 'mongodb://eksafdas:abc1035@ds121014.mlab.com:21014/heroku_2zt4zt62',//'mongodb://localhost/ConnectionTest';
        mail: {
            // account: "gmail",
            // user: "coffeeenglish2@gmail.com",
            // password: "^&jw6767"
            tweengle_email:"help@heyletz.com",
            SENDGRID_APIKEY : "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"
        },
        ot_embed_id: '5a5a6c7c-0b08-4c29-8e38-1b00f51aeafe',
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
      apiKey: '46143052',//'45933082', // process.env.API_KEY,
      apiSecret: '4464230683e5856b0c161dfbbd120fa761dc9324',//'4df52d6baab53c2a93be8b5f18d243a9dc8c2905', // process.env.API_SECRET
      dbURI: 'mongodb://eksafdas:abc1035@ds121014.mlab.com:21014/heroku_2zt4zt62',//'mongodb://localhost/ConnectionTest';
      mail: {
          // account: "gmail",
          // user: "coffeeenglish2@gmail.com",
          // password: "^&jw6767"
          tweengle_email:"help@heyletz.com",
          SENDGRID_APIKEY : "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"
      },
      ot_embed_id: 'cd2de047-8fa4-41ff-828a-3a377cca89d8',
      host : "www.heyLetz.com"
    };

if(test)
    module.exports = dev_version;
else
    module.exports = prod_version;
