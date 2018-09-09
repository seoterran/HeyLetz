//const notify = require('bootstrap-notify');

const strings= [
    '소개팅 시간 10분전 부터 입장이 가능합니다. 약속된 일정은 ', //0
    '새로 저장하실 이메일을 입력해주세요', //1
    '새로 입력하신 이메일이 이미 저장되어 있는 이메일과 같습니다', //2
    '이메일이 변경되었습니다!', //3
    'Please allow access to the Camera and Microphone and try publishing again.',//4
    'Error while setting RemoteDescription InvalidStateError',//5
    'Your browser failed to get access to your microphone. You may need to fully quit and restart your browser to get it to work',//6
    '카메라가 이미 다른 디바이스에 의해 이용중입니다. 카메라 설정을 확인해 주세요.',//7
    '디바이스의 상태를 다시 확인해주세요',//8
    '이미 다른 창에서 서비스를 이용중이세요',//9
    '브라우저 설정에서 카메라와 마이크의 액세스를 허용해 주세요.',//10
    '카메라 사용을 허용해 주셔야 영상통화가 가능합니다',//11
    '카메라/마이크 사용을 허용해 주셔야 영상통화가 가능합니다',//12

    '어땠어요? 다시 한번 대화해 보실래요? 양쪽이 원할 경우에는 영상통화로 다시 연결됩니다.',//13
    '다음에는 좋은 분과 인연이 되시길!',//14
    '결정할 수 있는 시간이 초과되어 소개팅이 종료되었습니다.',//15
    '아쉽게도 상대방이 선택하지 않았네요. 다음 번에는 꼭 잘 되셨으면 좋겠어요!',//16
    '소개팅이 종료되었어요 상대방과 다시 연락하고 싶으세요?',//17
    '마음에 드시는 분을 만나셔서 다행이네요! 상대방도 회원님이 마음에 들 경우 이메일로 연락처가 교환될거에요.',//18
    '다음에는 꼭 통하는 분 만나시길 진심으로 응원할게요!',//19
    '카메라가 이미 다른 디바이스에 의해 이용중 입니다.',//20
    '디바이스의 상태를 다시 확인해 주세요.', //21
    '상대분에 의해 소개팅이 중단 되었습니다.', //상대방이 선택하지 않은 경우 or 상대방이 창을 닫은경우 //22
    'Please allow access to the Camera and Microphone and try publishing again.',//23
    'Sorry, something went wrong. Error while setting RemoteDescription InvalidStateError',//24
    '아쉽게도 오늘은 인연을 찾지 못하였습니다. 다음 기회를 이용해 주세요...',//25
    'Your browser failed to get access to your microphone. You may need to fully quit and restart your browser to get it to work',//26
    'Sorry, something went wrong. You cannot publish an audio-video stream.',//27
    '<p>잘 되셨으면 좋겠네요! 잠시만 기다려주세요...</p>',//28
    '상대분과 연결되었습니다!',//29
    '상대분과 다시 연결 되었습니다! 좋은 시간 되세요...'//30
],
 onesec=1000,
 timeLimitForR1=obj.round1*onesec;
var published=false,
    subscribed=false,
    session,
    subscriber,
    stream,
    publisher,
    iLikeHimOrHer=false,
    HeOrSheLikeMe=false,
    connection,
    timerForR1,
    status=0,
    finalized=false,
    itvForR1,
    prodURL = false;

    session = OT.initSession(obj.apiKey, obj.sessionId);
    session.on('streamCreated', function(event) {
        let past = new Date().getTime();
        console.log ('new.js: streamCreated',past);

        subscriber= session.subscribe(event.stream, "subscriber",{
       //     insertMode: "append",
            height: "100%",
            width: "100%",
            subscribeToAudio:true,
            subscribeToVideo:true
        } ,function(error){
            if (error) {
                console.log(error.message);
            } else {
                let now = new Date().getTime();

                console.log ('new.js: subscribed',now,now-past);
                subscribed=true;
                if(published) gotReady();

            }
        });//, div);
        //session.subscribe(event.stream, "subscriber", { insertMode: "append" });
    });

//var user_controller = require('../Controllers/userController');
function checkTimeAndStart(){
   console.log('checkTimeAndStart');
   var url = '/appointment/checkDate/'+obj.appointmentId;
   $.ajax({
        url: url,
        type: 'GET',
        success: function (result) {
          //  alert("Your bookmark has been saved");
            console.log('checkTimeFromServer',result);
            if(result.valid){
               $('.ready').hide();
               start();
            }else {
               myAlert(strings[0]+result.appointmentDate+' '+ '오후 8시 30분 입니다');
            }
          //  myAlert(msg);
          },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('checkTimeFromServer');
            alert("Error, status = " + textStatus + ", " +
                    "error thrown: " + errorThrown
              );
          }
      });
}



function checkTime(){
   var current_url= window.location.host;

   if(current_url==="localhost:3000") {
      console.log('local',current_url);
   }else if(current_url.startsWith("quiet-chamber")){
      console.log('staging',current_url);
   }else{
      prodURL=true;
      console.log('production',current_url);
   }
}
function myAlert(msg){
   //console.log(myAlert,msg);
   $("#modal_text_new").text(msg);
   $("#myModal_new").modal();
}
function myAlert2(msg){
   //console.log(myAlert,msg);
   $("#modal_text_index2").text(msg);
   $("#myModal_index2").modal();
}

function myConfirm(msg){
   $("#confirm_text").text(msg);
   $("#myConfirm").modal();
}

function myOnclick(){
  console.log('myOnclick clicked');
  window.location.href = '/';
}
function displayAlert(msg){
  $.notify({
    message: msg,
    icon: 'glyphicon glyphicon-music'
  },{
    allow_dismiss: false,
    offset: {
      x: 500,
      y: 100
     },
    type: 'minimalist',
    template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
		'<img data-notify="icon" class="img-circle pull-left">' +
		'<span data-notify="title">{1}</span>' +
		'<span data-notify="message">{2}</span>' +
	'</div>',
      delay:500
});
}
function gotReady(){
  displayAlert(strings[29]);
  if(!obj.first){
      var extraTime = 3000;
      var startTime= (new Date()).getTime()+extraTime
    //  sendSignal(STARTTIME+" "+startTime);

      setTimeout(function(){
          sessionStart();
      }, extraTime);
    }
}

function sessionStart(){
    console.log("sessionStart ");
    updateCount(obj.round1);

    timerForR1=setTimeout(function(){
        finalize();
    //    clearInterval(itvForR1);
        $( "#r1_count" ).text('');
    }, timeLimitForR1);

    status=1;
}

function updateCount(myCount){
  var count=myCount;
  var min=Math.floor(count/60);
  var sec=count%60;

  var txt="남은시간:";
  if(min>0)
    txt+=min+"분 이상"
  else
    txt+=sec+"초";

  $( "#r1_count" ).text(txt);
  itvForR1=setInterval(function(){
     console.log('r1Count',count);
     if(--count==0)
        clearInterval(itvForR1);

     min=Math.floor(count/60);
     sec=count%60;

     txt="남은시간:";
     if(min>0)
       txt+=min+"분 "
     else
       txt+=sec+"초";

     $( "#r1_count" ).text(txt);
  }, onesec);
}


function finalize(){
    console.log('finalize');
    $( "#r1_count" ).text('');
    status=2;
    endChat();
    myConfirm(strings[17]);
}

function endChat(){
    console.log('chatEnd');
    publisher.destroy();
  //  iLikeHimOrHer=false;
    session.disconnect();
    if(status==5)
       myAlert(strings.s10);
    else if(status==6){
       myAlert(strings.s13);

     }
}

function start(){
  session.connect(obj.token, function (err) {
    if(err)  {
      console.log('session.connect err',err)
    }else{

    publisher= OT.initPublisher("publisher",{
        //  insertMode: "after",
        height: "15%",
        width: "15%"
    });
    publisher.on({
      VideoElementCreatedEvent: function(event){
        alert('VideoElementCreatedEvent');
        publisher.element='publisher';
      },
      accessAllowed: function (event) {
        console.log('accessAllowed');


      },
      accessDenied: function accessDeniedHandler(event) {
         myAlert(strings.s11);

        // The user has denied access to the camera and mic.
      },
      accessDialogOpened: function (event) {
         //myAlert(strings.s12);
        // The Allow/Deny dialog box is opened.
      },
      accessDialogClosed: function (event) {
        // The Allow/Deny dialog box is closed.
      }
    });
    //console.log('new.js',receivedPublisher);
    //  publisher= JSON.parse(receivedPublisher);
    //  publisher=receivedPublisher;

    if (session.capabilities.publish == 1){
      session.publish(publisher, function (error) {
        if(error){
          console.log(error);
          endChat();

          if(error.name==='OT_USER_MEDIA_ACCESS_DENIED')
              myAlert(string.s11);
          else if(error.name==='OT_SET_REMOTE_DESCRIPTION_FAILED')
              myAlert(strings.s12);
          else if (error.name==='OT_CHROME_MICROPHONE_ACQUISITION_ERROR')
              myAlert(strings.s14);
          else if(error.code==1500)
              myAlert(strings.s8);
          else
              myAlert(strings.s9);
        }else{
          console.log('new.js: session published');
          published = true;
          if (subscribed) gotReady();
        }
      });
    }else {
       myAlert(strings.s15);
    }
  }




    });
}

$(document).ready(function() {
    console.log('obj',obj,window.location.protocol);

    $('[data-toggle="tooltip"]').tooltip();
    $('.waiting').hide();
/*
    if(obj.repetitive){
        myAlert2(strings[9]);
        return;
    }
    //displayAlert('this is test');

    if(obj.gender==0)
        $('#male_radio').prop("checked", true);
    else
        $('#female_radio').prop("checked", true);

    $("#myEmail").click(function(event){
        $("#emailInput").val(obj.email);
        myConfirm(strings.s2);
    });

*/
    $("#confirm_btn_yes").click(function(event){
      iLikeHimOrHer=true;
      finalized=true;
      myAlert(strings[18]);
    });

    $("#confirm_btn_no").click(function(event){
       iLikeHimOrHer=false;
       finalized=true;
       myAlert(strings[19]);
    });

    $("#myModal_new").on("hide.bs.modal", function () {
       console.log('myConfirm close',finalized);
       var href;
       if(finalized){
          href ='/chat/finalize/'+obj.appointmentId+'/'+obj.personId+'/'+iLikeHimOrHer;
          $.ajax({
                  url: href,
                  type: 'GET',
                  success: function (result) {
                      if(result.done){
                         window.location.href = '/';
                      }
                    },
                  error: function(jqXHR, textStatus, errorThrown) {
                      alert("Error, status = " + textStatus + ", " +
                              "error thrown: " + errorThrown
                        );
                    }
                });
              }
    });

    $("#start").click(function(event){
        console.log('start is clicked ');
        event.stopPropagation();

        checkTimeAndStart();
  });

    $("#test").click(function(event){
        console.log('test is clicked ',obj.personId);
        event.stopPropagation();
        window.open('/chat/test/'+obj.personId, '_blank');


  });
});
