

const onesec=1000,
      timeLimitForR0=round0*onesec,
      timeLimitForR1=round1*onesec,
      timeLimitForR2=round2*onesec,
      breaktime=breakTime*onesec,
      timeLimitForWait=5*60*onesec,//5 mins
      strings= {
          s1: '어땠어요? 다시 한번 대화해 보실래요? 양쪽이 원할 경우에는 영상통화로 다시 연결됩니다.',
          s2: '다음에는 좋은 분과 인연이 되시길!',
          s3: '결정할 수 있는 시간이 초과되어 소개팅이 종료되었습니다.',
          s4: '아쉽게도 상대방이 선택하지 않았네요. 다음 번에는 꼭 잘 되셨으면 좋겠어요!',
          s5: '소개팅이 종료되었어요 상대방과 다시 연락하고 싶으세요?',
          s6: '마음에 드시는 분을 만나셔서 다행이네요! 상대방도 회원님이 마음에 들 경우 이메일로 연락처가 교환될거에요.',
          s7: '다음에는 꼭 통하는 분 만나시길 진심으로 응원할게요!',
          s8: '카메라가 이미 다른 디바이스에 의해 이용중 입니다.',
          s9: '디바이스의 상태를 다시 확인해 주세요.',
          s10:'상대분에 의해 소개팅이 중단 되었습니다.', //상대방이 선택하지 않은 경우 or 상대방이 창을 닫은경우
          s11:'Please allow access to the Camera and Microphone and try publishing again.',
          s12:'Sorry, something went wrong. Error while setting RemoteDescription InvalidStateError',
          s13:'아쉽게도 오늘은 인연을 찾지 못하였습니다. 다음 기회를 이용해 주세요...',
          s14:'Your browser failed to get access to your microphone. You may need to fully quit and restart your browser to get it to work',
          s15:'Sorry, something went wrong. You cannot publish an audio-video stream.',
          s16:'<p>잘 되셨으면 좋겠네요! 잠시만 기다려주세요...</p>',
          s17:'상대분과 음성통화가 연결되었습니다!',
          s18:'상대분과 다시 연결 되었습니다! 좋은 시간 되세요...'
      },
      STARTTIME="startTime";

var published=false,
    subscribed=false,
    session,
    subscriber,
    stream,
    publisher,
    iLikeProfile=false,
    HeOrSheLikeProfile=false,
    iLikeHimOrHer=false,
    HeOrSheLikeMe=false,
    iLoveHimOrHer=false,
    connection,
    reconnected=false,
    timerForBreak,
    timerForR1,
    timerForR2,
    status=-1, //1:r1,2:break,3:r2,4:finalized,5:disconnected
    finalized=false,
    startTimeForR2,
    itvForR1,
    itvForR2,
    breakCount=breakTime;
  //  r1Count=Math.floor(round1/60);
  //  r2Count=Math.floor(round2/60);


//console.log ('new.js: '+gender+'/'+apiKey+'/'+sessionId);

setTimeout(function(){
   if(status==0){
       console.log('no more wait');
       status=6;
       endChat();
     }
}, timeLimitForWait);

$('[data-toggle="tooltip"]').tooltip();

console.log('new.js',window.location.protocol);

function getPassedTime(startTime){
    return (new Date()).getTime() - startTime ;
}

function showProfile(){
  var gen=0;
  if(gender == 0)
    gen=1;
  var url = '/session/info/'+sessionId+'/'+gen;
  $.ajax({
       url : url,
       type : 'GET',
       success : function (result) {
         //  alert("Your bookmark has been saved");
          // console.log('checkTimeFromServer',sid,result.valid);
           profileAlert(result);
         //  myAlert(msg);
         },
       error: function(jqXHR, textStatus, errorThrown) {
        //   console.log('checkTimeFromServer');
           alert("Error, status = " + textStatus + ", " +
                   "error thrown: " + errorThrown
             );
         }
     });
}

/*
session.on("sessionDisconnected", function(event) {
      //event.preventDefault();
      console.log('sessionDisconnected');
});
*/

function setIFrameSize() {
    var parentDivWidth = $(window).width()*.9;//$("#testCallIframe").parent().width();
    var parentDivHeight =$(window).height()*.9; //$("#testCallIframe").parent().height();
  //  $("#video-holder")[0].setAttribute("width", parentDivWidth);
  //  $("#video-holder")[0].setAttribute("height", parentDivHeight);
    console.log('setIFrameSize',parentDivWidth,parentDivHeight);
  //  document.getElementById("video-holder").setAttribute("width", parentDivWidth);
  //  document.getElementById("video-holder").setAttribute("height", parentDivHeight);

    document.getElementById("video-holder").style.minWidth =parentDivWidth;
    document.getElementById("video-holder").style.minHeight =parentDivHeight;
}

$(function () {
    setIFrameSize();
    $(window).resize(function () {
        setIFrameSize();
    });
});

initializeSession();
function initializeSession() {

  session = OT.initSession(apiKey, sessionId);
  session.connect(token, function (err) {
      if (err) {
          alert(err.message || err);
      }else{

      //  publisher=sessionStorage.publisher ;
      //  publisher= sessionStorage.getItem("publisher");
        //  console.log('sessionStorage',publisher,Object.keys(publisher));
          /*
        publisher.on({
          VideoElementCreatedEvent: function(event){
            alert('VideoElementCreatedEvent');
            //publisher.element='publisher';
          }
        });
        */


    //    publisher.element='publisher';
        //  console.log('sessionStorage',publisher.id,publisher.element);

        publisher= OT.initPublisher("publisher",{
            //  insertMode: "after",
            height: "15%",
            width: "15%",
          //  backgroundImageURI : 'www.google.com'
        //    myPublisher.setStyle("backgroundImageURI", myPublisher.getImgData())
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
              publisher.publishAudio(false);
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

session.on('connectionCreated', function(event) {
    if(session.connection.connectionId!=event.connection.connectionId) {
        connection = event.connection;
        console.log('connectionCreated by someone else', connection);
    }
});

session.on("signal", function(event) {
    console.log("got Signal from connection " + event.from.id, event.data);
    let msg=event.data
    if(msg==="ILike"){
        HeOrSheLikeMe=true;
    }else if(msg==="ILikeProfile"){
        HeOrSheLikeProfile=true;
    }else if (msg.startsWith(STARTTIME)){
        let res = msg.split(" ");

        var startTime = res[1];
        var currentTime= (new Date()).getTime();
        var timeLeft = startTime-currentTime;

        setTimeout(function(){
            console.log(timeLeft,startTime);
            sessionStart();
        }, timeLeft);
    }
    // Process the event.data property, if there is any data.
});

session.on('streamCreated', function(event) {
    //var div = document.createElement('publisher');
    let past = new Date().getTime();
    console.log ('new.js: streamCreated',past);
    stream=event.stream;
  //  var profileUri = 'http://localhost:3000/arrange';//'http://localhost:3000/img/Woman-Relaxing-On-Bed.jpg';//'localhost:3000';

    subscriber= session.subscribe(event.stream, "subscriber",{
   //     insertMode: "append",
        height: "100%",
        width: "100%",
        subscribeToAudio:true,
        subscribeToVideo:false
    } ,function(error){
        if (error) {
            console.log(error.message);
        } else {
          //  subscriber.setStyle("backgroundImageURI", subscriber.getImgData());
          //  subscriber.setStyle("backgroundImageURI", profileUri);
            let now = new Date().getTime();

            console.log ('new.js: subscribed',now,now-past);
            subscribed=true;
            if(published) gotReady();

        }
    });//, div);
    //session.subscribe(event.stream, "subscriber", { insertMode: "append" });
});

session.on("streamDestroyed", function(event) {
    console.log("Stream 2" + event.stream.name + " ended. " + event.reason+' round: '+status);
/*
    if((iLikeHimOrHer)&&(!reconnected)) {
        alert('아쉽게도 상대방이 선택하지 않았습니다');
    }
    */
    if(status==1){ // r1
        clearTimeout(timerForR1);
        status=5;
        endChat();
     }/*else if(status==2){ //breakTime 굳이 상대방의 액션을 안보여줘도 될듯한데..
        clearTimeout(timerForBreak);
        hideMyConfirm();
        status=5;
        endChat();
     }*/else if(status==3){ //r2
        var passedTime = getPassedTime(startTimeForR2);
        var percent = passedTime/timeLimitForR2 ;
        console.log(passedTime,timeLimitForR2,percent);
        if(percent<.95){ //considered disconnection from other
           clearTimeout(timerForR2);
           status=5;
           endChat();
       }
     }
});

function displayAlert(msg){
/*  $("#alert").text(msg);
  $("#alert").show();
  $("#alert").delay(onesec*3).slideUp(200, function() {
     //  $(this).alert('close');
     $("#alert").hide();
  });
  */
  $.notify( {
    message:msg,
    icon: 'glyphicon glyphicon-music'
  },{
  	allow_dismiss: false,
    offset: {
  		x: 500,
  		y: 100
  	},
    delay:500,
/*  	placement: {
  		from: 'top',
  		align: 'right'
    },
    */
    animate: {
  		enter: 'animated zoomInDown',
  		exit: 'animated zoomOutUp'
  	}
  });

}

function updateCount(myCount, selector){
  var count=myCount;
  var jSelector = selector|| "#r1_count" ;
  var min=Math.floor(count/60);
  var sec=count%60;

  var txt="남은시간:";
  if(min>0)
    txt+=min+"분 이상"
  else
    txt+=sec+"초";

  $( jSelector).text(txt);
  itvForR1=setInterval(function(){
     //console.log('r1Count',count);
     if(--count==0)
        clearInterval(itvForR1);

     min=Math.floor(count/60);
     sec=count%60;

     txt="남은시간:";
     if(min>0)
       txt+=min+"분 "
     else
       txt+=sec+"초";

     $( jSelector ).text(txt);
  }, onesec);
}

function gotReady(){
  //  sessionStart();
  //  return;
  //displayAlert(strings.s17);
  showProfile();
  if(gender==0){
      var extraTime = 3000;
      var startTime= (new Date()).getTime()+extraTime
      sendSignal(STARTTIME+" "+startTime);

      setTimeout(function(){
          sessionStart();
          $( "#myModal_profile .count" ).text('');
      }, extraTime);
    }
}
function sessionStart(){
    console.log("sessionStart ");

    status = 0;
    updateCount(round0,"#myModal_profile .count");
    setTimeout(function(){
      //  pause();
      //  clearInterval(itvForR1);
      voiceTalkStart();
    //  $( "#myModal_profile .count" ).text('');
    }, timeLimitForR0);
}

function voiceTalkStart(){
  console.log('voiceTalkStart');
  if(!iLikeProfile){
      endChat();
      hideMyConfirm("#myModal_profile");
      myAlert(strings.s3);
      return;
  }
  if(!HeOrSheLikeProfile){
      endChat();
      hideMyConfirm("#myModal_profile");
      myAlert(strings.s4);
      return;
  }
  publisher.publishAudio(true);
  updateCount(round1);

  timerForR1=setTimeout(function(){
      pause();
      clearInterval(itvForR1);
      $( "#r1_count" ).text('');
  }, timeLimitForR1);

  status=1;
}

function pause(){
    console.log('pause');
    //session.unpublish(publisher);
    //published = false;
    session.unsubscribe(subscriber); //DOM removed

    var holder=document.getElementById("video-holder");
    var div_subscriber = document.createElement('div');
    div_subscriber.setAttribute('id', 'subscriber');

    var div_waiting = document.createElement('div');
    div_waiting.setAttribute('id', 'waiting');

    var div_spinner = document.createElement('div');
    div_spinner.setAttribute('id', 'spinner');

    div_waiting.appendChild(div_spinner);
    div_subscriber.appendChild(div_waiting);
    holder.appendChild(div_subscriber);

    status=2;
    subscribed = false;
    //publisher.publishVideo(false);
    timerForBreak=setTimeout(function(){
          //  clearInterval(timer); //do we need this?
       resumeChat();
    },breaktime);
    myConfirm(strings.s1);
    var itv=setInterval(function(){
    //   console.log('breakCount',breakCount);
       if(--breakCount==0)
          clearInterval(itv);
       var txt=" "+breakCount+"초 안에 결정해 주세요";
       $( "#confirm_count" ).text(txt);
    }, onesec);
}

function resumeChat(){
    if(!iLikeHimOrHer){
        endChat();
        hideMyConfirm("#myConfirm");
        myAlert(strings.s3);
        return;
    }
    if(!HeOrSheLikeMe){
        endChat();
        hideMyConfirm("#myConfirm");
        myAlert(strings.s4);
        return;
    }
    console.log('resume');

    session.subscribe(stream, "subscriber",{
        height: "100%",//"600px",
        width: "100%",
        subscribeToAudio:true,
        subscribeToVideo:true
    } ,function(error){
        if (error) {
            console.log(error.message);
        } else {
            reconnected=true;
            subscribed=true;
            status=3;
            //if(published) sessionStart();
            console.log("Subscribed to stream: " + stream.id);
            updateCount(round2);
            timerForR2= setTimeout(function(){
                finalize();
            },timeLimitForR2);
            startTimeForR2=(new Date()).getTime();
            displayAlert(strings.s18);
        }
    });
}

function finalize(){
    console.log('finalize');
    $( "#r1_count" ).text('');
    status=4;
    endChat();
    myConfirm2(strings.s5);
}

function endChat(){
    console.log('chatEnd');
    publisher.destroy();
    iLikeHimOrHer=false;
    session.disconnect();
    if(status==5)
       myAlert(strings.s10);
    else if(status==6){
       myAlert(strings.s13);

     }
}
function profileAlert(result){
   $("#hobby").text(result.hobby);
   $("#selfIntro").text(result.selfIntro);
   $("#idealType").text(result.idealType);
   $("#myModal_profile").modal();
}
function myAlert(msg){
   //console.log(myAlert,msg);
    $("#modal_text_new").text(msg);
    $("#myModal_new").modal();
}
function hideMyConfirm(selector){
    $(selector).modal('hide');
}
function myConfirm(msg){
   //console.log(myAlert,msg);
    $("#confirm_text").text(msg);
    $("#myConfirm").modal();
}
function myConfirm2(msg){
   //console.log(myAlert,msg);
    $("#confirm_text2").text(msg);
    $("#myConfirm2").modal();
}

function sendSignal(msg){

    session.signal({
          to: connection,
          data:msg
      }, function(error) {
          if (error) {
              console.log("signal error ("
                  + error.name
                  + "): " + error.message);
          } else {
              console.log("signal sent-> ",msg);
          }
      });
}
$(document).ready(function() {
    //  var con=connection;
    $("#confirm_btn_yes2").click(function(event){
       iLoveHimOrHer=true;
       finalized=true;
       myAlert(strings.s6);
    //  window.location.href ='/new/finalize/'+userId+'/'+iLoveHimOrHer;
    });
    $("#confirm_btn_no2").click(function(event){
       iLoveHimOrHer=false;
       finalized=true;
       myAlert(strings.s7);
    });

    $("#myModal_new").on("hide.bs.modal", function () {
       console.log('myConfirm close',finalized);
       if(finalized)
          window.location.href ='/new/finalize/'+userId+'/'+iLoveHimOrHer;
       else
          window.location.href = '/new/leave/' + userId+'/'+gender;
    });

    $("#myModal_profile .btn-success").click(function(event){
          console.log('yes clicked',connection);
          iLikeProfile = true;

        //  $('#waiting').html('잠시 기다려주세요...');
          $( "#waiting" ).append( "<p>잠시 기다려주세요...</p>" );
          $('#waiting').addClass('waiting');
          $('#spinner').addClass('spinner');
          sendSignal("ILikeProfile");
      });

      $("#myModal_profile .btn-default").click(function(event){
            console.log('no clicked',connection);
            iLikeProfile = false;
          //  clearTimeout();
            endChat();
            myAlert(strings.s2);
        });


    $("#confirm_btn_yes").click(function(event){
          console.log('yes clicked',connection);
          iLikeHimOrHer=true;

        //  $('#waiting').html('잠시 기다려주세요...');
          $( "#waiting" ).append( "<p>잠시 기다려주세요...</p>" );
          $('#waiting').addClass('waiting');
          $('#spinner').addClass('spinner');
          sendSignal("ILike");

      });

    $("#confirm_btn_no").click(function(event){
          console.log('no clicked',timerForBreak);
          iLikeHimOrHer=false;
        //  clearInterval(timer);
          clearTimeout(timerForBreak);
          endChat();
          myAlert(strings.s2);
        });


  /*
    $(".start").click(function (event) {
        var options = $(".archive-options").serialize();
        disableForm();
        $.post("/start", options).fail(enableForm);
    }).show();
    $(".stop").click(function(event){
        $.get("stop/" + archiveID);
    }).hide();
    */
});
/*
function disableForm() {
    $(".archive-options-fields").attr('disabled', 'disabled');
}

function enableForm() {
    $(".archive-options-fields").removeAttr('disabled');
}
*/
