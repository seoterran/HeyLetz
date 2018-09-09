
const config = require('../config'),
      test = config.test,
      apiKey = config.apiKey,
      apiSecret = config.apiSecret,
      express = require('express'),
      router = express.Router(),
      OpenTok = require('../../lib/opentok'),
      session_controller = require('../controllers/sessionController'),
      email_controller = require('../controllers//emailController'),
      tweengle_email=config.mail.tweengle_email,
      user_controller = require('../controllers/userController');

    //  dialog = require('dialog');
        //bodyParser = require('body-parser'),
        //request = require('request'),
//var userId;//hmm...

if (!apiKey || !apiSecret) {
    console.log('You must specify API_KEY and API_SECRET environment variables');
    process.exit(1);
}

var opentok = new OpenTok(apiKey, apiSecret);

var male_list=[],
    female_list=[],
    matched_list=[];

function person(user,  OT_sessionId , gender ) {

    this.first = user.name;
    // this.lastName = last;
    this.id = user._id;
   // this.sid = sid;
    this.gender = gender;
    this.contact=user.contact;
    this.email=user.email;
    this.OT_sessionId = OT_sessionId;
    //console.log('new person: '+first+'/'+gender+'/'+sessionId);
}

function match(first, second) {
    if(first.gender==0){
        this.male=first;
        this.female=second;
    }else{
        this.male=second;
        this.female=first;
    }
    var objId=this.male.id+this.female.id;
    var ids= {
        male :{
            userId:this.male.id,
            contact:this.male.contact,
            email:this.male.email
        },
        female:{
            userId:this.female.id,
            contact:this.female.contact,
            email:this.female.email
        },
        objId:objId,
        OT_sessionId : first.OT_sessionId
    };
    this.objId=objId;
    console.log("match:",objId,this.male.id,this.female.id);

    session_controller.create(ids);
}

function render(res,me,mobile=false){
/*
    dialog.info('소개팅을 곧 시작합니다. 상대 이성이 조인할 때까지 잠시 기다려 주세요.','HeyLetz',function(exitCode){
      if (exitCode == 0){
      }
    });
    */
//  console.log('render1');
  //  return;
    var OT_sessionId=me.OT_sessionId;

    var token = opentok.generateToken(OT_sessionId, {
        role: 'moderator',
        expireTime : (new Date().getTime() / 1000)+( 15 * 60)// in 15 minutes
    });

    console.log('render after generating token3: ',config.sessionTime,mobile);
    var result = {
        user:true,
        apiKey: apiKey,
        sessionId: OT_sessionId,
        token: token,
        gender: me.gender,
        userId: me.id,
        round0: config.sessionTime.round0,
        round1: config.sessionTime.round1,
        round2: config.sessionTime.round2,
        breakTime: config.sessionTime.breakTime
    };
    if(mobile)
      res.json(result);
    else
      res.render('new.ejs',result);
}

function createSession(res,user,gender,my_list,mobile){
    console.log('createSession',my_list);
    //return;
   // var mylist=my_list;

    opentok.createSession({ mediaMode: 'routed' },function(err, session) {
        if (err) throw err;
        //app.set('sessionId', session.sessionId);

        var OT_sessionId=session.sessionId;
        var me = new person(user,OT_sessionId, gender);
        console.log('waiting for a partner! : '+gender);

        my_list.push(me);
        console.log('waiting for a partner!2',my_list);
        render(res,me,mobile);
    });
}

function matchPush(gender,user,partner,res,mobile){
    console.log('no session: '+partner.first+'/'+partner.OT_sessionId);
    var OT_sessionId=partner.OT_sessionId;
    var me = new person(user, OT_sessionId, gender);
    matched_list.push(new match(me,partner) );
    render(res,me,mobile);
}

function findSession(gender,user,res,length,my_list,mobile){
    if(length==0) {
        console.log('cannot find available user');
        createSession(res,user,gender,my_list,mobile);
        return;
    }

    var partner_list = (gender==0) ? female_list : male_list;
    var partner = partner_list.shift();

    console.log(findSession,typeof user._id,typeof partner.id);
    if(test) {
    // if(my_list.length==0)
         console.log('my_list.length', my_list.length);
  //   else
      //   my_list.shift();
       matchPush( gender, user, partner, res,mobile);
    }else{
       var query=session_controller.find(user, partner);
       matchPush( gender, user, partner, res,mobile);
       /*
       맺어졌던 사람과 다시 안맺기 위한 코드
       query.then(function (session) {
          //console.log('session_controller.find callback');
          if (!session) {
          //    my_list.shift();
              matchPush( gender, user, partner, res,mobile);
          }else {
              console.log('session exists', partner_list.length);
          //    partner_list.unshift(partner);
              partner_list.push(partner);
              findSession(gender, user, res,length-1,my_list,mobile);
          }
      }).catch(error => {
          console.log("error caught: " + error)
      });
      */
    }
}

function checkIfCurrentUser(my_list,user){
  //  var my_list=(gender==0)?male_list :female_list ;
    var repetitive=false;
    my_list.forEach(function(item, index, array) {
        //  console.log('my_list.forEach',typeof user._id,typeof item.id);
        var second=user._id.toString();
        var first=item.id.toString();
       // console.log('my_list.forEach',typeof first,typeof second,first,second);
        if( first==second){
            repetitive=true;
        }else
            console.log('my_list.forEach not same');
    });
    return repetitive;
}

function userJoin(user,res,test_gender,mobile){
    //var gender=user.gender;
    var gender = (test_gender==-1) ? user.gender : test_gender;
    //var OT_sessionId;
   // var name=user.name;
    //var id=user._id;
    var my_list,partner_list;
    console.log('userJoin');

    if(gender=='0'){
        partner_list=female_list;
        my_list=male_list;
    }else{
        partner_list=male_list;
        my_list=female_list;
    }
    var repetitive=checkIfCurrentUser(my_list,user);
    repetitive = false; //for testing
    if(repetitive){
      //  console.log('already login');
      //  alert('이미 로그인 하셨습니다');
        //res.redirect('landing.ejs'); not working
      /*  dialog.info('이미 로그인 하셨습니다.','HeyLetz',function(exitCode){
          if (exitCode == 0) console.log('User closed window');
        });
        */
      //  res.redirect('/repetitive');

        res.render('index.ejs',{
           data: {
              repetitive: true,
              name: user.name,
              gender:gender,
              test: false,
              sid: 'dfa',
              email: user.email,
              credit: user.credit
            }
        } );

      return;
    }
  //  console.log('hmm');
    //userId=user._id;
    var length=partner_list.length;
    if(length > 0) {
        //var partner,query;
        findSession(gender,user,res,length,my_list,mobile);
    }else{
      //  console.log(userJoin,length,my_list);
        createSession(res,user,gender,my_list,mobile);
    }
    return 0;
}

//console.log('newMatch');
function getUser(sid,gender,res,mobile){
    console.log('getUser');
    var query = user_controller.getUser(sid);
    query.then(function (user) {
        if(!user){
            console.log('no user');
            /*
            res.render('signup.ejs',{
              found:true
            });
            */
            if(mobile){
              let result = {
                    user:false
                };
              res.json(result);
            }else
              res.redirect('/signup');
        }else {
            userJoin(user,res,gender,mobile);
        }
    });
}

router.get('/token', function(req, res) {
    console.log('token');
    res.json({
        apiKey: '45933082',
        sessionId:'2_MX40NTkzMzA4Mn5-MTUxNjQ3Mzk1NjQ0MH5ENkVzMGR3b0xEYUdhQVNWSHU3QzNCL1Z-fg',
        token: 'T1==cGFydG5lcl9pZD00NTkzMzA4MiZzaWc9MjA3MjY4Yjg1N2IzYTU4MDkzZTg0YjI5NDU3ZjMzZDZkNmUwOTI4ODpzZXNzaW9uX2lkPTJfTVg0ME5Ua3pNekE0TW41LU1UVXhOalEzTXprMU5qUTBNSDVFTmtWek1HUjNiMHhFWVVkaFFWTldTSFUzUXpOQ0wxWi1mZyZjcmVhdGVfdGltZT0xNTE2NDczOTY2Jm5vbmNlPTAuMjIwMzk3MDIzMTA3NDAwNiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTE5MDY1OTY2JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9'
    });
});

router.get('/checkTime/:sid', function(req, res) {
      if(test){
        res.json({
          'valid': true
        });
      }
      var sid=req.params.sid;
      var date=new Date();
      var hour=date.getUTCHours();
      var minute=date.getUTCMinutes();
      var result=false;
      var msg;
      var sbj="소개팅 시도 ";

      if((hour==config.time.hour)&&(minute < config.time.minute)){
         result = true;
       }else if((hour==config.time2.hour)&&(minute < config.time2.minute)){
         result = true;
       }

       if(result)
          sbj+= '성공!';
       else
          sbj+= '실패!';

       var query = user_controller.getUser(sid);
       query.then(function (user) {
           if(user){
                msg = {
                    to: tweengle_email,
                    from: tweengle_email,
                    subject: sbj,
                    text:  user.name+ ' 소개팅 시도 at ' +hour +':'+minute+
                    '('+config.time.hour+'시'+ config.time.minute+','+
                    config.time2.hour+'시'+config.time2.minute+')'
                 };
                 email_controller.send(msg,0);

                 console.log("checkTime",hour,minute,result,user.auth);

                 res.json({
                   'valid': result,
                   'auth': user.auth
                 });
                  return;
           }else{
             res.json({
                 'valid': false,
                 'auth': false
             });
         }

      });
});

router.get('/status', function(req, res) {
      console.log('status',male_list,female_list,matched_list);
      res.json({
        'male_list': male_list,
        'female_list':female_list,
        'matched_list':matched_list
      });
});

router.get('/reset', function(req, res) {
      var male_list_= male_list;
      var female_list_=female_list;
      var matched_list_=matched_list;

      male_list=[];
      female_list=[];
      matched_list=[];
      console.log('reset',male_list,female_list,matched_list);
      res.json({
        'male_list_': male_list_,
        'female_list_':female_list_,
        'matched_list_':matched_list_,
        'male_list': male_list,
        'female_list':female_list,
        'matched_list':matched_list
      });
});

router.get('/leave/:userId/:gender', function(req, res) {
   var userId=req.params.userId;
   var gender=req.params.gender;
   var my_list;

   if(gender==0)
      my_list=male_list;
   else
      my_list=female_list;

   console.log('leave start',my_list);
   for (var i = 0, len = my_list.length; i < len; i++) {
      var item=my_list[i];
      if(item.id==userId){
          my_list.splice(i,1);
          console.log('leave done ',i);
          break;
      }
    }
    console.log('leave done',my_list);
    res.redirect('/');
});

router.get('/finalize/:userId/:iLoveHimOrHer/:mobile?', function(req, res) {
    var userId=req.params.userId;
    var iLoveHimOrHer=req.params.iLoveHimOrHer;
    var partnerId,partnerGender,myGener;
    var mobile= false;
    if (req.params.mobile)
       mobile = req.params.mobile;
    var hmm=false;
   // var indexToRemove=-1;
    console.log('finalize session',matched_list.length);
    for (var i = 0, len = matched_list.length; i < len; i++) {
      //  console.log('iteration:',len, i);
        var item=matched_list[i];
        if((item.male.id==userId)||(item.female.id==userId)){
            var sessionId=item.objId;

            if(iLoveHimOrHer)
                session_controller.finalize(sessionId,userId);

            if(item.male.id==userId) {
                console.log('male:'+ userId,len, i);
                partnerId = item.female.id;
                myGener = 0;
                partnerGender=1;
            }else {
                console.log('female:'+ userId,len, i);
                partnerId = item.male.id;
                myGener = 1;
                partnerGender=0;
            }
            hmm=true;
           // console.log(item.male.id,item.female.id);
            // indexToRemove=index;
            console.log('finalize session before:',matched_list);
            matched_list.splice(i,1);
            console.log('finalize session after:',matched_list);
            break;
        }
    }/*
    if(!hmm){
        console.log('WTF!',len, i);
        msg = {
          to: tweengle_email,
          from: tweengle_email,
          subject: 'WTF',
          text:   'WTF'
        };
        email_controller.send(msg,0);
        res.render('landing.ejs');
        return;
    }*/
    var data={
        reporter_userId: userId,
        reporter_gender: myGener,
        partner_userId:partnerId ,
        partner_gender:partnerGender,
        sessionId: sessionId
    };
    console.log('finalize session end',data);
    if(mobile){
      res.json(data);
    }else
      res.render('report.ejs', data);
});

//for dev. version
router.get('/:sid/:gender/:mobile?', function(req, res) {
    // var sessionId = app.get('sessionId');
    var sid = req.params.sid,
        gender = req.params.gender;
    var mobile= false;
    if (req.params.mobile)
       mobile = req.params.mobile;
    console.log('router.get(/:sid/:gender --> /new/'+sid+'/'+gender);
    getUser(sid,gender,res,mobile);
    // router.use('/new',newMatch);
});
/*
router.get('/:sid/:mobile?', function(req, res) {
    // var sessionId = app.get('sessionId');
    var sid=req.params.sid;
    var mobile= false;
    if (req.params.mobile)
       mobile = req.params.mobile;
    console.log('/new/ '+sid);
    getUser(sid,-1,res);
   // router.use('/new',newMatch);
});
*/
module.exports = router;
