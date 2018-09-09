
const config = require('../config'),
      test = config.test,
      apiKey = config.apiKey,
      apiSecret = config.apiSecret,
      express = require('express'),
      router = express.Router(),
      OpenTok = require('../../lib/opentok'),
      session_controller = require('../controllers/sessionController'),
      appointment_controller = require('../controllers/appointmentController'),
      email_controller = require('../controllers//emailController'),
      tweengle_email=config.mail.tweengle_email,
      uuidv4 = require('uuid/v4'),
      user_controller = require('../controllers/userController');

if (!apiKey || !apiSecret) {
          console.log('You must specify API_KEY and API_SECRET environment variables');
          process.exit(1);
}

var opentok = new OpenTok(apiKey, apiSecret);

function startPage(res,appointment,personId,sessionId){
  var token = opentok.generateToken(sessionId, {
      role: 'moderator',
      expireTime : (new Date().getTime() / 1000)+( 15 * 60)// in 15 minutes
  });
  var data = {
    data :{
      appointmentId : appointment._id,
      personId: personId,
      apiKey : apiKey, //?
      token: token,
      sessionId : sessionId,
      round1: config.sessionTime.round1,
      first : false
    }}
  console.log('partner is waiting! : ',data);
  res.render('start.ejs',data);
}

router.get('/test/', function(req, res) {
  //var personId=req.params.personId;

  res.render('test.ejs',{
    data:{
      embedId : config.ot_embed_id,
      personId: uuidv4()
  }
  });
});

router.get('/:appointmentId/:personId', function(req, res) {
//  console.log('chatcontroller');
  var appointmentId=req.params.appointmentId;
  var personId=req.params.personId;
  var query = appointment_controller.getAppointment(appointmentId);
  query.then(function (appointment) {
      if(appointment){
          const appointmentId = appointment._id;
          const sessionId = appointment.OTsessionId;
          if(sessionId){
            console.log('partner is waiting! : ');
            startPage(res,appointment,personId,sessionId);
          }else{
            opentok.createSession({ mediaMode: 'routed' },function(err, session) {
                if (err) throw err;
                  appointment.OTsessionId = session.sessionId;
                  appointment.save(function(err, updatedAppoint){
                      console.log('waiting for a partner! : ');
                      startPage(res,appointment,personId,updatedAppoint.OTsessionId);
                  });
            });
          }
      }
    });
});



router.get('/finalize/:appointmentId/:personId/:iLikeHimOrHer', function(req, res) {
  var appointmentId=req.params.appointmentId;
  var personId=req.params.personId;
  var iLikeHimOrHer=req.params.iLikeHimOrHer;
  appointment_controller.finalizeAppointment(appointmentId,personId,iLikeHimOrHer);
  res.json({
    done:true
  });
});
module.exports = router;
