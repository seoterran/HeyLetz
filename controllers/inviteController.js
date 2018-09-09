const Invite = require('../models/invite'),
      //User = require('../models/user'),
      express = require('express'),
      router = express.Router(),
      config = require('../config'),
    //  me = require('../models/me'),
      email_controller = require('./emailController'),
      tweengle_email=config.mail.tweengle_email,
      //popupS = require('popups'),
    //  dialog = require('dialog'),
      sixDigits = 1000000,
      googleFormLink = 'https://goo.gl/forms/AuGk2pWcfc79lX293',
      test = config.test;

router.get('/generate/', function(req, res) {
  res.render('generate.ejs');
});

function get6digitId(){
  var random = Math.floor((Math.random() * sixDigits) + 1);
  return random;
}

router.get('/:email', function(req, res) {
    var email=req.params.email;
    //console.log('invite');

    var msg = {
        to: email,
        from: tweengle_email,
        subject: '초대장을 신청해 주세요',
        html:   '환영합니다!'+'<br>'+' HeyLetz에서 귀하께 초대장 신청 링크를 보내드리오니 다음 링크를 클릭하셔서 신청 양식을 작성해주세요!'+ '<Br><Br>'+
        googleFormLink+'<Br><Br>'+
        'HeyLetz 팀'
    };
    email_controller.send(msg,0);

    res.send({
       done: true,
       email: email
    });
});

router.get('/generate/id/:katokId/:email', function(req, res) {

    var email=req.params.email;
    var inv= new Invite();
    var inviteId=get6digitId();
    inv.inviteId=inviteId;
    inv.katokId=req.params.katokId;
    inv.email=email;

    Invite.create(inv, function(err, doc){
        if(err) return err;
        console.log('created',doc);

        var msg = {
            to: email,
            from: tweengle_email,
            subject: '초대장',
          //  text:'text test',
            html:   'HeyLetz에서 귀하를 초대합니다! '+'<Br>'+
            '다음 링크에서 초대 번호( '+inviteId+' )를 입력해 주세요!'+'<Br><Br>'+
            'www.heyletz.com/signup'+'<Br><Br>'+
            'HeyLetz 팀'
        };
        email_controller.send(msg,0);

        res.send({
           valid: true,
           email: email,
           inviteId: inviteId
        });
    });
});

router.get('/checkInviteId/:inviteId/:katokId', function(req, res) {
          var inviteId=req.params.inviteId;
          var katokId=req.params.katokId;
          //var lastLogin=new Date().getTime();
          //console.log('find',typeof sid,sid);
          Invite.findOne({ 'inviteId':inviteId,
                           'katokId':katokId,
                           'accepted':false
                        }, function (err, invite) {
              if (err) return handleError(err);
              if (invite) {
                 res.send({
                   valid: true
                 });
              } else {
                  console.log('inviteId not found',inviteId,katokId);
                  res.send({
                     valid: false
                  });
              }
      });
});

module.exports = router;
