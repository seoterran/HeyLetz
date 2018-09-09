const User = require('../models/user'),
      express = require('express'),
      router = express.Router(),
      config = require('../config'),
      me = require('../models/me'),
      email_controller = require('./emailController'),
      tweengle_email=config.mail.tweengle_email,
      Invite = require('../models/invite'),
      //popupS = require('popups'),
    //  dialog = require('dialog'),
      test = config.test;


router.get('/delete/:sid', function(req, res) {
        var sid=req.params.sid;
        console.log('about to delete',sid);
        User.deleteOne({ sid: sid }, function (err) {
          if (err) return handleError(err);
          console.log('deleted',sid);
          res.json({
              deleted : true
          });
        });
      });

router.get('/auth/:id', function(req, res) {
        var id=req.params.id;
        User.findById(id,  function (err, user) {
          if (err) return handleError(err);
          if (user) {
              if(!user.auth){
                user.auth = true;
                user.save(function (err) {
                  console.log('auth done!');

                  var msg = {
                      to: tweengle_email,
                      from: tweengle_email,
                      subject: '인증완료',
                      text:   user.name+'님이 인증완료 하였습니다 '+user.school+'/'+user.major
                  };
                  email_controller.send(msg,0);


                  res.render('auth.ejs',{
                    name : user.name,
                    already : false
                  });
                });
              }else{
                  console.log('auth not done!');
                  res.render('auth.ejs',{
                    name : user.name,
                    already : true
                });
              }
          }
        });
      });

router.get('/info/:sid', function(req, res) {
          var sid=req.params.sid;

          User.findOne({'sid': sid}, function (err, user) {
            if (err) return handleError(err);
            if (user) {
              res.send({
                newEmail:user.email,
                hobby:user.hobby,
                selfIntro:user.selfIntro,
                idealType:user.idealType
              });
            }
          });
      });

router.get('/:sid/:mobile?', function(req, res) {
    var sid=req.params.sid;
    var mobile= false;
    if (req.params.mobile)
       mobile = req.params.mobile;
    var lastLogin=new Date().getTime();
    //console.log('find',typeof sid,sid);
    User.findOne({'sid': sid}, function (err, user) {
        if (err) return handleError(err);
        if (user) {
            user.visit++;
            user.lastLogin=lastLogin;
            console.log('found ', user,test,user.credit); // Space Ghost is a talk show host.
            user.save(function (err) {
              if (err) return handleError(err);
              var result={
                 user:true,
                 name: user.name,
                 gender:user.gender,
                 test:test,
                 sid:sid,
                 email: user.email,
                 hobby: user.hobby,
                 selfIntro : user.selfIntro,
                 idealType : user.idealType,
                 credit: user.credit,
                 auth:user.auth,
                 repetitive :false
               }
              if(mobile){
                res.json(result);
              }else{
                res.render('index.ejs',{data :result});
            }
            });
        }else {

        /*   res.render('signup.ejs', {
             found:false
           });*/
           if(mobile){
              console.log('not found');
              res.json({user:false});
           }else
              res.redirect('/signup');
             //  apiKey: config.apiKey,
          /*
          dialog.info('아직 HeyLetz 회원이 아닙니다. 회원가입하시겠어요?','HeyLetz',function(exitCode){
            if (exitCode == 0){
              res.render('signup.ejs');
            }
          });*/

            // res.send('you are not a user');

             /*
            res.render('signup.ejs',{
                found: false
              });
              */
        }
    });
});


router.getUser=function(sid) {
    //  var sid_ = Number(sid);
    return User.findOne({'sid': sid}, 'name gender _id contact email');
};


router.post('/email', function(req, res) {
  //  var newEmail=req.body.newEmail;
    var sid=req.body.sid;

    var query=User.findOne({'sid': sid});
    query.then((user)=>{
      if(user){
        user.email=req.body.newEmail;
        user.hobby=req.body.hobby;
        user.selfIntro=req.body.selfIntro;
        user.idealType=req.body.idealType;

        user.save(function (err) {
            if (err) return handleError(err);
            console.log('saved!');
            //res.redirect('/user/'+sid);
            res.send({
              newEmail:user.email
            });
/*
            popupS.alert({
                content: '이메일이 '+user.email+'로 변경되었습니다!'
            });
*/
            /*
            dialog.info('이메일이 '+user.email+'로 변경되었습니다!','HeyLetz',function(exitCode){

              if (exitCode == 0){
              }
            });
            */
        });
      }
  }).catch((err)=>{
       res.send(err);
   });
});

router.post('/checkEmail/', function(req, res) {
     var refEmail=req.body.refEmail;
    // console.log('checkEmail',refEmail);
     var query=User.findOne({'email': refEmail});
     query.then((user)=>{
       if(user){
           console.log('checkEmail',refEmail,'found');
           res.send({
               found: true
            });
            return;
       }
       console.log('checkEmail',refEmail,'not found');
       res.send({
             found: false
       });
   }).catch((err)=>{
        res.send(err);
    });
});

function setInviteToTrue(kakaoId){
  Invite.findOne({ 'katokId':kakaoId,
                  'accepted':false
                }, function (err, invite) {
      if (err) return handleError(err);
      if (invite) {
          invite.accepted = true
          invite.save(function (err) {
             if (err) return handleError(err);
             console.log('invite set to true');
           });
      }
    });
}

router.post('/auth/', function(req, res) {
  var sid=req.body.sid;
  var school=req.body.school;
  var major=req.body.major;
  var collegeEmail=req.body.collegeEmail;

  console.log('auth request');

  User.findOneAndUpdate({'sid': sid},
  {
    school:school,
    major:major,
    collegeEmail:collegeEmail
  },
  function(err, user){

    var msg = {
        to: tweengle_email,
        from: tweengle_email,
        subject: '인증요청!',
        text:   user.name+'님이 인증요청하였습니다 '+user.school+'/'+user.major
    };
    email_controller.send(msg,0);

    var authLink = config.host+'/user/auth/'+user._id;
    var msg2 = {
        to: user.collegeEmail,
        from: tweengle_email,
        subject: '학교인증',
        html: user.name+'님, 아래 링크를 클릭하셔서 이메일 인증을 해주세요 <br><br>'
            + "<a href='+authLink+' target='_blank'>"+authLink+ "</a>"
    };

    email_controller.send(msg2,0);

      res.send({
          done : true
      });


      console.log('auth request done');
  });
});

//module.exports.create = function(req, res) {
router.post('/create/', function(req, res) {
    var sid=req.body.sid;
    var name=req.body.name;
    var email=req.body.email;
    var gender=req.body.gender;
    var age=req.body.age;
        //    var admission=req.body.admission;
  /*  var selfIntro=req.body.selfIntro;
    var career=req.body.career;
    var hobby=req.body.hobby;
      var refEmail=req.body.refEmail;
*/
    var contact=req.body.contact;
    var date=new Date().getTime();

    console.log('userController.create',sid,gender);

    User.findOne({'sid': sid}, 'name visit gender', function (err, user) {
        if (err) return handleError(err);
        if (user) {
            console.log(user.name,'already exists.', 'visit is',user.visit); // Space Ghost is a talk show host.
           // user.visit++;
            user.save(function (err) {
                if (err) return handleError(err);
                console.log('saved!');
                //res.redirect('/user/'+sid);
                res.send({
                    redirect: '/user/'+sid,
                    found : true
                });
            });
        }else {
            console.log('not found');
            User.create({
                 sid: sid,
                 name: name,
                 gender: gender,
                 age:age,
                // adms:admission,
                /*
                 school:school,
                 major:major,
                 selfIntro:selfIntro,
                 career:career,
                 hobby:hobby,
                 collegeEmail:collegeEmail,
                     refEmail:refEmail,
                     */
                 email:email,
                 signup: date,
                 lastLogin:date,
                 contact:contact,
                 visit:0,
                 credit:5
            }, function (err, small) {
                if (err) return handleError(err);
                console.log('user created',small);

                setInviteToTrue(contact);

                var msg = {
                    to: tweengle_email,
                    from: tweengle_email,
                    subject: '회원가입!',
                    text:   small.name+'님이 가입하였습니다'
                };
                email_controller.send(msg,0);


                /*
                if(refEmail!=''){
                   User.update({'refEmail': refEmail},
                      {$inc: {credit: 5}}, function(err,user){
                          if (err) return handleError(err);
                          console.log('user(', user.email, ') updated credit is', user.credit);
                          User.update({'sid': sid},
                              {$inc: {credit: 5}}, function(err,user2){
                                  if (err) return handleError(err);
                                  console.log('user(', user2.email, ') updated credit is', user2.credit);
                          });
                  });
              }
              */
              //  res.redirect('/user/'+sid); //only works for GET

                res.send({
                    redirect: '/user/'+sid,
                    found : false
                });

            });
        }
    });
});
module.exports = router;
