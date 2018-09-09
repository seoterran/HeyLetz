const mongoose = require('mongoose'),
      Appointment = require('../models/appointment'),
      email_controller = require('../controllers//emailController'),
      config = require('../config'),
      express = require('express'),
      router = express.Router(),
      os = require('os'),
      intersection = require('array-intersection'),
      moment = require('moment'),
    //  sha1 = require('sha1'),
      heyletz_email=config.mail.tweengle_email,
      test = config.test;

router.post('/', function(req, res) {

    var input= req.body;
  /*  for ( let person of input.persons){
        var str = person.name + person.email;
        person.hash = sha1(str);
    }*/
  //  console.log('report:',input);
    Appointment.create(input, function (err, appoint) {
        if (err) return handleError(err);
        console.log('An appointment created',appoint);

        var sbj = "소개팅이 주선되었습니다";
        var scheduleLink = config.host+"/appointment/schedule/"+appoint._id+'/';

        for ( let person of appoint.persons){
            console.log( 'person', person._id);
            var msg = {
              to: person.email,
              from: heyletz_email,
              subject: sbj,
              html:  input.matchmaker.name+ '님이 '+ person.name +'님을 위해 화상 소개팅을 주선하였습니다! 아래 링크를 클릭하시면 소개팅 가능하신 날짜를 선택할 수 있어!!<br>'
              +"<a href="+scheduleLink +person._id+" target='_blank'>here</a>"
            };
            email_controller.send(msg,0);
         }

         var msgToheyletz = {
           to: heyletz_email,
           from: heyletz_email,
           subject: sbj,
           html:  input.matchmaker.name+ '님이 화상 소개팅을 주선하였습니다! 아래 링크를 클릭해서 소개팅 가능하신 날짜를 선택해 주세요!<br>'
         };
         email_controller.send(msgToheyletz,0);

        var data={
            created: true
        };
        res.send(data);
    });
});



function sendEmail(appointment){
  var dDate = moment(appointment.appointmentDate).format('YYYY/MM/DD');
  var sbj = "소개팅 날짜가 잡혔어요!";
  var videoDateLink = config.host+"/chat/"+appoint._id+'/';

  for(let person of appointment.persons){
      var msg = {
        to: person.email,
        from: heyletz_email,
        subject: sbj,
        html:  appointment.matchmaker.name+ ' 님이 주선하신 '+ person.name +'님의 화상 소개팅이 '+ dDate+ ' 오후 8시 30분에 잡혔습니다. 해당 시간 30분 전에 아래 링크를 클릭해서 화상 소개팅을 준비해주세요<br>'
        +"<a href="+videoDateLink+person._id+" target='_blank'>here</a>"
      };
      email_controller.send(msg,0);
    }
}

function sendFailureEmail(appointment){
//  var dDate = moment(appointment.appointmentDate).format('YYYY/MM/DD');
  var sbj = "안타깝네요";
  //var videoDateLink = host+"/chat/"+appoint._id+'/';

  for(let person of appointment.persons){
      var msg = {
        to: person.email,
        from: heyletz_email,
        subject: sbj,
        html:  appointment.matchmaker.name+ ' 님이 주선하신 소개팅이 성사 되지 않았네요'
      };
      email_controller.send(msg,0);
    }
}

function sendSuccessEmailtoBoth(appointment){

  var sbj = "축하합니다!";
  var partner = "";
  var me = "";
  var persons = appointment.persons;
  for(let i in appointment.persons){

      partner = i ? persons[0] :persons[1];
      me = persons[i];
      var msg = {
        to: person[i].email,
        from: heyletz_email,
        subject: sbj,
        html:  partner.name+ ' 님도 '+me.name+'에게 호감을 표시하셨어요! 어서 '+partner.contact+' 로 연락해보세요!'
      };
      email_controller.send(msg,0);
    }
}

function sendFauilureEmail(appointment, personId){
  var sbj = "안타깝네요!";

  for(let person of appointment.persons){
      if(person._id==personId){
        var msg = {
          to: person.email,
          from: heyletz_email,
          subject: sbj,
          html:  person.name+'님, 안타깝게도 소개팅이 성사되지 않았네요.. 다음번에는 꼭 잘 되시길 바래요!'
        };
        email_controller.send(msg,0);
      }
    //  me = persons[i];
    }
}

router.getAppointment=function(appointmentId) {
    return Appointment.findById(appointmentId);
};

router.finalizeAppointment=function(appointmentId, personId,iLikeHimOrHer) {

  Appointment.findById(appointmentId, function (err, appoint) {
    if (err) return handleError(err);
    if (appoint) {
      var like = 0;
      for(let person of appoint.persons){
        if(person._id==personId){
          person.iLikeHimOrHer = iLikeHimOrHer?1:-1;
        }
      }
      appoint.save(function(err,updatedAppoint){
        if(iLikeHimOrHer){
          for(let person of updatedAppoint.persons){
            if(person._id!=personId){
                if(person.iLikeHimOrHer==1){
                    sendSuccessEmailtoBoth(updatedAppoint);
                }else if (person.iLikeHimOrHer==-1){
                    sendFauilureEmail(updatedAppoint,personId);
                }
            }
          }
        }else{
          for(let person of updatedAppoint.persons){
            if(person._id!=personId){
                if(person.iLikeHimOrHer==1){
                    sendFauilureEmail(updatedAppoint,person._id);
                }
            }
        }
      }
    });

    }
  });

}
function compare(persons){
  //console.log('compare');
  var momentDates =[];
  for(let person of persons){
    var dates= person.availability;
    var momentDate = dates.map(function(date){
       var res= moment(date).format('YYYY/MM/DD');
       //  console.log('moment',res);
       return res;
    });
    momentDates.push(momentDate);
    console.log(momentDates);
  }
  var inter= [];
//  console.log('availability',me.availability,thePerson.availability);
  if( (momentDates[0].length != 0) && (momentDates[1].length != 0) ){
     inter = intersection(momentDates[0], momentDates[1]);
     console.log('inter', inter, momentDates[0],momentDates[1]);
  }
  return inter;
}

router.post('/availability', function(req, res) {
    var appointId= req.body.appointId;
    var personId= req.body.personId;
    var availability= req.body.availability;
    var contact= req.body.contact;
   //console.log(appointId,personId,availability);
    Appointment.findById(appointId, function (err, appoint) {
        if (err) return handleError(err);
        if (appoint) {
            //var me, thePerson;
            for ( let person of appoint.persons){
              if(person._id == personId){
              //  me = person;
              //  console.log('availability',availability);
                person.contact = contact;
                person.availability = availability;
                appoint.save(function(err, updatedAppoint){
                   if (err) return handleError(err);
                   console.log('appoint saved',availability)

                   var dDate = compare(appoint.persons);
                   if(dDate.length!=0){
                       updatedAppoint.appointmentDate = dDate[0];
                       updatedAppoint.save(function(err, app){
                          sendEmail(app);
                       })
                     }
                   var data={
                         submitted: true
                     };
                   res.send(data);
                  });
              }
            }

        }
      });
});

router.get('/schedule/:appointId/:personId', function(req, res) {
   //console.log('appointment/schedule/');
    var appointId= req.params.appointId;
    var personId= req.params.personId;

    res.render('schedule.ejs',{
      data : {
        appointId : appointId,
        personId: personId
    }});
});

router.get('/chat/:appointId/:personId', function(req, res) {
   //console.log('appointment/schedule/');
    var appointId= req.params.appointId;
    var personId= req.params.personId;

    res.render('chat.ejs',{
      data : {
        appointmentId : appointId,
        personId: personId
    }});
});

router.get('/checkDate/:appointmentId', function(req, res) {
    var appointmentId= req.params.appointmentId;

    Appointment.findById(appointmentId, function (err, appoint) {
        var dDate = moment(appoint.appointmentDate).format('YYYY/MM/DD');
        var appointTime = moment.utc(appoint.appointmentDate).add(8,'hours').add(30,'minutes');//.format('YYYY/MM/DD');
        var startTime = new moment( appointTime.add(-10,'minutes'));
        var endTime = new moment(appointTime.add(20,'minutes'));
        var now =new moment().utc() ;

        var isCorrectTime =  now.isBetween(startTime,endTime);;

        console.log('checkDate',now,startTime,endTime,isCorrectTime,dDate);
        res.json({

            valid: isCorrectTime,
            appointmentDate : dDate
        });
    });

});


module.exports = router;
