// Dependencies
const express = require('express'),
      app = express(),
    //  http = require('http'),
    //  express_enforces_ssl = require('express-enforces-ssl'),
    // secure = require('express-force-https'),
      router = express.Router(),
      invite_controller = require('./controllers/inviteController'),
      user_controller = require('./controllers/userController'),
      report_controller = require('./controllers/reportController'),
      appointment_controller = require('./controllers/appointmentController'),
      chat_controller = require('./controllers/chatController'),
      college_controller = require('./controllers/collegeController'),
      session_controller = require('./controllers/sessionController'),
      upload_controller = require('./controllers/uploadController'),
      bodyParser = require('body-parser'),
      newMatch = require('./routes/newMatch'),
      forceSsl = require('force-ssl-heroku'),
      path = require('path'),
      config = require('./config');
require('./models/db');//required
/*
"express-enforces-ssl": "^1.1.0",
  "letsencrypt-express": "^2.0.6",
  */
// request = require('request'),
// Verify that the API Key and API Secret are defined
// Initialize the express app =-
//app.use(secure);
app.use(router);
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 3000));
app.set('views', __dirname + '/views');

//app.use(express.static(path.join(__dirname, '..','build'));
app.use(express.static('build'));
app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/public_site'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//app.use(express.static('static'));
app.use(forceSsl);

// middleware to use for all requests
app.all(function(req, res, next) {
    // do logging
  //  console.log('Something is happening.');
//  console.log(req.url,window.location.host);
  next(); // make sure we go to the next routes and don't stop here
});

app.get('/', function(req, res) { //use 로 바꾸면 뭔가 이상함..왜
    //res.render('landing.ejs');
    console.log('root');
  //  res.sendFile('./public_site/index.html');
  var filePath = path.join(__dirname,'..','build','app_index.html');
  res.sendFile(filePath);
});

app.get('/signup',function(req, res) {
    /*
    res.render('signup.ejs',{
      found:true
    });
    */
      console.log('signup');
    var filePath = path.join(__dirname,'..','build','app_index.html');
  /*  res.render('signup_main.ejs',{
      invited:true,
      found:true
    });

*/

     res.sendFile(filePath);
});

app.get('/signup_react',function(req, res) {
  //  var filePath = path.resolve(__dirname+'/../build/index.html');
  var filePath = path.join(__dirname,'..','build','index.html');

  console.log('signup_react2',filePath);
//  res.sendFile(path.join(__dirname+'/sitemap.html'));

  res.sendFile(filePath);
  //  res.sendFile(path.join(__dirname+'/signup_react.html'));
});

app.get('/signup/:katokId',function(req, res) {
    var katokId=req.params.katokId;
    res.render('signup_main.ejs',{
      invited:true,
      found:true,
      katokId:katokId
    });
});

app.get('/signup2',function(req, res) {
    res.render('signup.ejs',{
      found:false
    });
});

app.get('/report',function(req, res) {
    res.render('report.ejs');
});

app.get('/arrange',function(req, res) {
    res.render('arrange.ejs');
});

app.use(function (req, res, next) {
  console.log('Time:', Date.now(),req.url);
  next();
});

app.use('/new',newMatch);
app.use('/user',user_controller);
app.use('/invite',invite_controller);
app.use('/report',report_controller);
app.use('/session',session_controller);
app.use('/appointment',appointment_controller);
app.use('/chat',chat_controller);
app.use('/college',college_controller);
app.use('/upload',upload_controller);
app.get('/health-check', (req, res) => res.sendStatus(200));

init();
// Start the express app
function init() {
    var server = app.listen(app.get('port'),function() {
     //  var host = server.address().address;
       var port = server.address().port;
       console.log('You\'re app is now ready at',port);
    });
}

//app.get('/index/:sid', user_controller.find);
//app.post('/create',  user_controller.create);
//app.post('/finalize',  session_controller.finalize);


/*
var me = new user({ name: 'kim2' });
me.speak();
*/

/*
router.get('/signup_redirect/:sid/:gender', function(req, res) {
    res.render('index.ejs', {
        name: req.params.name,
        gender: req.params.gender
    });
});
*/

//router.get('/create/:sid', user_controller.create);
//app.post('/create',function(req,res){
// router.post('/index/:sid',user_controller.create);
//app.post('/index', user_controller);

/*
app.use('/index/:sid',function(req, res) {
    var sid=req.params.sid;
    var result= user_controller.find(sid);
    if(result) {
       res.render('index.ejs', {
           name: 'ffda',//user.name,
           gender: 1//user.gender
       });
    }
    else {
        res.send('you are not a user');
    }

});
*/

//router.get('/index', user_controller.find);

/*newMatch.matched_list.forEach(function(item, index, array) {
     console.log('matched_list: ',item.male.gender, index);
 });*/

//app.use(router);

// Initialize OpenTok


/*
router.use(function (req, res, next) {
   // if (!req.headers['x-auth']) return next('router')
    next()
})
*/

/*
app.all('/', function (req, res, next) {
    console.log('Someone made a request!');
    next();
});
// Create a session and store it in the express app

/*
app.get('/rematch/:', function(req, res) {


});*/
