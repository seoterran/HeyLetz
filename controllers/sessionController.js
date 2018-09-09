const mongoose = require('mongoose'),
      Session = require('../models/session'),
      User = require('../models/user'),
      express = require('express'),
      router = express.Router(),
      config = require('../config'),
      email_controller = require('./emailController'),
      test = config.test,
      heyletz_email = config.mail.tweengle_email;

function sendEmail(me,partner_userId){

  console.log('sendEmail',partner_userId);
  User.findById( partner_userId, function (err, partner) {
   //  if (err) return handleError(err);

     var str='축하합니다. '+ partner.name+'님도 '+me.name+'님을 마음에 들어하시네요! '+partner.name+'님은'+partner.school+'에서 '+partner.major+'를 전공 중입니다.'+partner.name+'님의 연락처로 어서 연락해보세요! ->';
     var msg = {
         to: partner.email,
         from: heyletz_email,
         subject: '축하합니다!',
         text:  str+ partner.contact
     };
     email_controller.send(msg,1);

     str='축하합니다. '+ me.name+'님도 '+partner.name+'님을 마음에 들어하시네요!'+me.name+'님은'+me.school+'에서 '+me.major+'를 전공 중입니다.'+me.name+'님의 연락처로 어서 연락해보세요! ->';
     msg = {
         to: me.email,
         from: heyletz_email,
         subject: '축하합니다!',
         text: str + me.contact
     };
     email_controller.send(msg,1);
   });
}

router.finalize = function(sessionId, userId) {
    console.log('Session controller finalize:',userId,sessionId);
    var date=new Date();//.getTime();
    var hash=0;
    User.findById(userId, function (err, user) {
        /*
        var update;
        var query= {
            sessionId: sessionId
        };
        */
        Session.findOne({'sessionId': sessionId}, function (err, session) {
            if (err) return handleError(err);

            if(user.gender==0)
                session.male.ilike=2;
            else
                session.female.ilike=2;

            session.stage=5;
            session.save(function (err, updatedSession) {
               if (err) return handleError(err);
               console.log('session updated', updatedSession);
                //console('session updated', session.male.ilike, session.female.ilike);
               var partner_userId;
               if ((user.gender == 0) && (updatedSession.female.ilike == 2)){
                  partner_userId=updatedSession.female.userId;
                  sendEmail(user,partner_userId);
               } else if ((user.gender == 1) && (updatedSession.male.ilike == 2)){
                  partner_userId=updatedSession.male.userId;
                  sendEmail(user,partner_userId);
               }else {
                  console.log('not send Email');
               }
            });
          });
        /*
                Session.findByIdAndUpdate(sessionId, { $set: update}, { new: true }, function (err, session) {
                  if (err) return handleError(err);
                  if(session) {
                    console.log('session updated', session);
                      //console('session updated', session.male.ilike, session.female.ilike);
                      var partner;
                      if ((user.gender == 0) && (session.female.ilike == 2)) {
                          partner = session.female;
                          sendEmail(user,partner);
                      } else if ((user.gender == 1) && (session.male.ilike == 2)) {
                          partner = session.male;
                          sendEmail(user,partner);
                      }
                      //res.send(session);
                  }else
                      console('no session updated');
                });
        Session.update(query, {$set : update}, function(err,session){
            if (err) return handleError(err);
            if(session) {
              console.log('session updated', session);
                //console('session updated', session.male.ilike, session.female.ilike);
                var partner;
                if ((user.gender == 0) && (session.female.ilike == 2)) {
                    partner = session.female;
                    sendEmail(user,partner);
                } else if ((user.gender == 1) && (session.male.ilike == 2)) {
                    partner = session.male;
                    sendEmail(user,partner);
                }
                //res.send(session);
            }else
                console('no session updated');
        });
        */
    });
}
router.find=function(me,partner){
    var sessionId;
    //var sessionId=getCustomId(objId);
    if(partner.gender==0){
        sessionId=partner.id+me._id;
    }else
        sessionId=me._id+partner.id;
    console.log('sessionController.find',sessionId);
    return Session.findOne({'sessionId': sessionId});
}
function getCustomId(objId){
    var ObjectId = mongoose.Types.ObjectId;
    console.log('getCustomId',objId);
   // var customId= new ObjectId(objId);
   // var customId= mongoose.mongo.BSONPure.ObjectID.fromHexString(objId);

   // var customId= ObjectId.fromString(objId);
  //  var customId= ObjectId('34567899');
    console.log("Converting to ObjectId from [%s] to [%s]", objId, customId);
    return customId;
}
function createSession(ids,sessionId){
  var date = new Date();
  Session.create({
      sessionId: sessionId,
      OTsessionId: ids.OT_sessionId,
      male: {
          userId: ids.male.userId,
          ilike: 0,
          contact:ids.male.contact ,
          email:ids.male.email
      },
      female: {
          userId: ids.female.userId,
          ilike: 0,
          contact: ids.female.contact,
          email:ids.female.email
      },
      type: 0,
      date: date,
      stage: 0
  }, function (err, small) {
      if (err) return handleError(err);
    //  console.log('A session created');

      User.findById( ids.male.userId, function (err, user) {
        user.credit--;
        user.save(function (err, updatedUser) {
          console.log('A session created id(credit)',ids.male.userId,updatedUser.credit);
        });
      });
      User.findById( ids.female.userId, function (err, user) {
        user.credit--;
        user.save(function (err, updatedUser) {
          console.log('A session created id(credit)',ids.female.userId,updatedUser.credit);

        });
      });
  });
}
router.create = function(ids) {

    var sessionId = ids.objId;// ids.male.userId + ids.female.userId;
   // var sessionId=getCustomId(objId);
   // console.log('Session controller create', sessionId);

    Session.findOne({'sessionId': sessionId},'_id', function (err, session) {
        if (err) return handleError(err);

        if (session) {
            console.log('sessionControllers/session',sessionId,'exists');
            if(test){
              Session.remove({'sessionId': sessionId}, function (err) {
                  console.log('sessionControllers/session',sessionId,'removed');
                  createSession(ids,sessionId);
              });
            }
        } else {
            console.log('sessionControllers/session',sessionId,'does not exists');
            createSession(ids,sessionId);
        }
    });
}

router.get('/info/:OT_sessionId/:gender', function(req, res) {
    var OT_sessionId = req.params.OT_sessionId;
    var gender= req.params.gender;
    Session.findOne({'OTsessionId': OT_sessionId}, function (err, session) {
       if (err) return handleError(err);
       if(session){
            var userId;
            if(gender==0)
                userId = session.male.userId;
            else {
                userId = session.female.userId;
            }

            User.findById(userId, function (err, user) {
              if(user){
                  res.json({
                     hobby : user.hobby,
                     selfIntro : user.selfIntro,
                     idealType :user.idealType
                  });
                }else {
                   console.log('no user');
                }

             });
       }else{
         console.log('no session')
       }
    });

});
module.exports = router;
