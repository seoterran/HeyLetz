//const notify = require('bootstrap-notify');

const strings= {
    s1: '이용 가능한 시간은 한국시간 9PM이나 미국 동부시간 11PM부터 10분간 입니다',
    s2: '새로 저장하실 이메일을 입력해주세요',
    s3: '새로 입력하신 이메일이 이미 저장되어 있는 이메일과 같습니다',
    s4: '이메일이 변경되었습니다!',
    s5: 'Please allow access to the Camera and Microphone and try publishing again.',
    s6: 'Error while setting RemoteDescription InvalidStateError',
    s7: 'Your browser failed to get access to your microphone. You may need to fully quit and restart your browser to get it to work',
    s8: '카메라가 이미 다른 디바이스에 의해 이용중입니다. 카메라 설정을 확인해 주세요.',
    s9: '디바이스의 상태를 다시 확인해주세요',
    s10:'이미 다른 창에서 서비스를 이용중이세요',
    s11:'브라우저 설정에서 카메라와 마이크의 액세스를 허용해 주세요.',
    s12:'카메라 사용을 허용해 주셔야 영상통화가 가능합니다',
    s13:'카메라/마이크 사용을 허용해 주셔야 영상통화가 가능합니다',
    s14:'최대한 근처의 상대를 찾기 위해 본인의 위치를 입력해 주시기 바랍니다',
    s15:'변경된 프로필이 저장되었습니다',
    s16: '학교 인증을 위해 본인의 학생증 사진이나 학교 이메일을 입력해 주세요',
    s17: '본인이 재학 중인 학교를 선택해 주세요',
    s18: '인증이 완료되면 이메일로 알려드릴게요',
    s19: '학교 인증을 먼저 완료해 주시기 바랍니다'
}; 

var prodURL = false;
var s3Response,s3File=null;
var s3 ;
//var user_controller = require('../Controllers/userController');
function checkTimeFromServer(sid){
  //console.log('checkTimeFromServer',sid);
   var url = '/new/checkTime/'+sid;
   $.ajax({
        url: url,
        type: 'GET',
        success: function (result) {
          //  alert("Your bookmark has been saved");
            console.log('checkTimeFromServer',sid,result.valid);
            result.valid = true; //일시적으로 테스팅을 위해
            if(result.valid){
                 if(result.auth)
                     window.location.href = '/new/' + sid + '/-1';
                  else {
                     myAlert(strings.s19);
                  }
            }else {
                  myAlert(strings.s1);
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

function setCollegeDomain(college){
  var domain='';
  switch(college){
    case "아주대학교":
      domain="@ajou.ac.kr";
      break;
    case "경희대학교":
        domain="@khu.ac.kr";
        break;
    case "성균관대학교":
        domain="@skku.edu";
        break;
    case "가천대학교":
      domain="@gachon.ac.kr";
      break;
    case "동서울대학교":
        domain="@du.ac.kr";
        break;
  }
  console.log('setCollegeDomain',domain,college);
  $('#collegeDomain').text(domain);
}

function resetSelect(){
  var select = document.getElementById('major');
  select.selectedIndex = -1;
}

function setMajor(arr){

//  console.log('setMajor',arr);
  var select = document.getElementById('major');
  $('#major').empty();

//  $('#major').selectedIndex = -1;
  for(var major of arr){
      var opt = document.createElement('option');
      opt.value = major;
      opt.innerHTML = major;
    //  opt.text = major;
    //  console.log(opt);
      select.appendChild(opt);
  }

    resetSelect();
  //$('#college').selectmenu("refresh", true);
}

/*
   Function to carry out the actual PUT request to S3 using the signed request from the app.
 */
 function uploadFile(){
   console.log('uploadFile',s3File);
   if(s3File==null)
      return;
   const xhr = new XMLHttpRequest();

   console.log('uploadFile',s3File,s3Response.signedRequest, s3Response.url);
   xhr.open('PUT', s3Response.signedRequest);

   xhr.onreadystatechange = () => {

     if(xhr.readyState === 4){
       if(xhr.status === 200){
    //     document.getElementById('preview').src = url;
      //   document.getElementById('avatar-url').value = url;
       }
       else{
         alert('사진 업로드 실패');
       }
     }
   };
   xhr.send(s3File);
 }
 /*
   Function to get the temporary signed request from the app.
   If request successful, continue to upload the file using this signed
   request.
 */
 function getSignedRequest(file){
   //console.log('getSignedRequest');
   const xhr = new XMLHttpRequest();
   var filename = file.name;
   var filetype = file.type;
   // xhr.open('GET', `/upload/sign-s3?file-name=${file.name}&file-type=${file.type}`);
   xhr.open('GET', `/upload/sign-s3?file-name=${filename}&file-type=${filetype}`);

   xhr.onreadystatechange = () => {
     if(xhr.readyState === 4){
       if(xhr.status === 200){
         s3Response = JSON.parse(xhr.responseText);
         s3File = file;
         console.log('response',s3Response);
        // uploadFile(file, response.signedRequest, response.url);
       }
       else{
         alert('Could not get signed URL.:'+xhr.status);
       }
     }
   };
   xhr.send();
 }
 /*
  Function called when file input updated. If there is a file selected, then
  start upload procedure by asking for a signed request from the app.
 */
 function initUpload(){
  // console.log('initUpload');
   const files = document.getElementById('file-input').files;
   const file = files[0];
  // var albumPhotosKey = encodeURIComponent(albumName) + '//';
//   var photoKey = albumPhotosKey + fileName;
   if(file == null){
     return alert('No file selected.');
   }
   getSignedRequest(file);

 }

function checkTime(){
//  if(hour==13){ //10pm
   var current_url= window.location.host;

   if(current_url==="localhost:3000") {
      console.log('local',current_url);
   }else if(current_url.startsWith("quiet-chamber")){
      console.log('staging',current_url);
   }else{
      prodURL=true;
      console.log('production',current_url);
     /*
     if((hour==6)&&(minute<10))
       return true;

     return false;
     */
   }
//   checkTimeFromServer(sid);
  //return true;
}
function myAlert(msg){
   //console.log(myAlert,msg);
   $("#modal_text_index").text(msg);
   $("#myModal_index").modal();
}
function myAlert2(msg){
   //console.log(myAlert,msg);
   $("#modal_text_index2").text(msg);
   $("#myModal_index2").modal();
}

function myConfirm(msg){
   if(msg)
     $("#confirm_text").text(msg);
   $("#myConfirm").modal();
}


/*
function myAlert(msg){
   $("#modal_text_new").text(msg);
   $("#myModal_new").modal();
}*/
function redirect(){

   if(obj.test) {
      console.log('index.js test');
      var male = $('#male_radio').is(':checked');
      var btn_gender = male ? 0 : 1;
     //checkTimeFromServer(sid);
      window.location.href= '/new/' + obj.sid + '/' + btn_gender;
   }else{
     if(obj.auth==='false'){
         myAlert(strings.s19);
         return;
       }

     var url = '/new/checkTime/'+obj.sid;
     $.ajax({
          url: url,
          type: 'GET',
          success: function (result) {
            //  alert("Your bookmark has been saved");
              console.log('checkTimeFromServer',obj.sid,result.auth,result.valid);
              result.valid = true; //일시적으로 테스팅을 위해
              if(result.valid){
              //   if(result.auth)
                     window.location.href = '/new/' + obj.sid  + '/-1';
                //  else {
                  //   myAlert(strings.s19);
                  //}
              }else {
                 myAlert(strings.s1);
              }
            },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log('checkTimeFromServer');
              alert("Error, status = " + textStatus + ", " +
                      "error thrown: " + errorThrown
                );
            }
        });
    //  checkTime(obj.sid);
  //    checkTimeFromServer(obj.sid);
    /*  var timeUp=checkTime(sid);

      if(timeUp){
          window.location.href = '/new/' + sid;
       }else{
          console.log('not yet');
          event.stopPropagation();
          myAlert('소개팅 가능한 시간은 10시~10시분 까지 입니다');
      }*/

    }
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

function validate(){
  var collegeEmail =  $('#collegeEmail').val();
/*  var collegeDomain =   'fda'; //$('#collegeDomain').text();

  if(!collegeDomain){
      myAlert(strings.s17);
      return false;
  }
  */

  var college = $('#college').val();

  if(college === '학교명'){
        myAlert(strings.s17);
        return false;
    }

  if(!collegeEmail && !s3File){
      myAlert(strings.s16);
      return false;
  }
  return true;
}

function submitToServer(){
  console.log('submitToServer');
  const school = $('#college').val();
  const major = $('#major').val();
  const collegeEmail = $('#collegeEmail').val();

  $.post( "/user/auth", {
        sid: obj.sid,
        school:school,
        major:major,
        collegeEmail:collegeEmail
     },function(output, status){
        console.log('saved',output.done);
      //  obj.email=output.newEmail;
         myAlert(strings.s18);
      //  myAlert(strings.s4+' ('+obj.email+')');//   이메일이 '+user.email+'로 변경되었습니다!'
    });
}

function initCollege(){
  var url = '/college/names';

  $.ajax({
          url: url,
          type: 'GET',
          success: function (result) {
            var select = document.getElementById('college');
            for(var college of result){
                var opt = document.createElement('option');
                opt.value = college;
                opt.innerHTML = college;
                select.appendChild(opt);
            }
          },
          error:   function(jqXHR, textStatus, errorThrown) {
              alert("Error, status = " + textStatus + ", " +
                    "error thrown: " + errorThrown
              );
          }
      });
}

$(document).ready(function() {
    console.log('gender',obj.gender,window.location.protocol);
    $('#address').val("");
    $("#postcodify").postcodify({
        // insertPostcode5 : "#postcode",
             insertAddress : "#address",
        //   insertDetails : "#details",
        //   insertExtraInfo : "#extra_info",
        //   hideOldAddresses : true,
        results:$('#result'),
        searchButtonContent:"주소 검색",
        hideSummary:true,
        afterSelect : function(){
             console.log('afterSelect');
             var add=$('#address').val();
             $('#address').val('"'+add+ '" 근처의 상대를 검색합니다');
             $('#result').hide();
           }
     });

     $("#postcodify").click(function(event){
        //   console.log('postcodify clicked');
           $('#result').show();
       });



    $('[data-toggle="tooltip"]').tooltip();
/*
    if(obj.repetitive){
        myAlert2(strings.s10);
        return;
    }
    */
    //displayAlert('this is test');

    if(obj.gender==0)
        $('#male_radio').prop("checked", true);
    else
        $('#female_radio').prop("checked", true);



    $("#myEmail").click(function(event){

       var url = '/user/info/'+obj.sid;
       $.ajax({
           url : url,
           type : 'GET',
           success : function (result) {

                $("#emailInput").val(result.newEmail);
                $("#selfIntroInput").val(result.selfIntro);
                $("#idealTypeInput").val(result.idealType);
                $("#hobbyInput").val(result.hobby);
                myConfirm();
             },
           error: function(jqXHR, textStatus, errorThrown) {
            //   console.log('checkTimeFromServer');
               alert("Error, status = " + textStatus + ", " +
                       "error thrown: " + errorThrown
                 );
             }
         });
    });

    $("#auth").click(function(event){
      initCollege();

      document.getElementById('college').selectedIndex = -1;
      $( "#college" ).change(function() {
        var college = $( "#college option:selected" ).val();
        //  console.log('selected',$( "#college option:selected" ).val());
      //  setCollegeDomain(college);
        var url = '/college/major/'+college;

        $.ajax({
                url: url,
                type: 'GET',
              //  data: {'refEmail': refEmail}, // An object with the key 'submit' and value 'true;
                success: function (result) {
                //  alert("Your bookmark has been saved");
                //  console.log(result);
                  setMajor(result);
                  return;
                  /*
                  var msg= result.found?
                      strings.s3:
                      strings.s4;
                  myAlert(msg);*/
                },
                error:   function(jqXHR, textStatus, errorThrown) {
                    alert("Error, status = " + textStatus + ", " +
                          "error thrown: " + errorThrown
                    );
                }
            });
      });

        document.getElementById('file-input').onchange = initUpload;
        $("#authConfirm").modal();
    });

    $("#authConfirm .btn-success").click(function(event){
        if(!validate()) return;

        submitToServer();
        uploadFile();
    });

    $("#confirm_btn_yes").click(function(event){
          var newEmail=$("#emailInput").val();
          var hobby=$("#hobbyInput").val();
          var selfIntro=$("#selfIntroInput").val();
          var idealType=$("#idealTypeInput").val();
          console.log('yes clicked',obj.email,newEmail);

          $.post( "/user/email", {
                sid: obj.sid,
                newEmail :newEmail,
                hobby :hobby,
                selfIntro :selfIntro,
                idealType :idealType
             },function(output, status){
                console.log('saved',output.newEmail);
                obj.email=output.newEmail;
                 myAlert(strings.s15);
              //  myAlert(strings.s4+' ('+obj.email+')');//   이메일이 '+user.email+'로 변경되었습니다!'
            });
    });
    $("#testCall").click(function(event){
        console.log('test is clicked ',obj.personId);
        event.stopPropagation();
        window.open('/chat/test/','_blank');
    });

    $("#start").click(function(event){
        console.log('start is clicked');
        event.stopPropagation();
        if(!obj.test){
            var address = $('#address').val();
            if(address===""){
              myAlert(strings.s14);
              return;
            }
          }



      //  var session = OT.initSession(apiKey, sessionId);
        var publisher= OT.initPublisher({
            //  insertMode: "after",
          //  insertDefaultUI:false,
            height: "0px",
            width: "0px",
            publishVideo:false,
            publishAudio:false,
            showControls:false
        },function(error){

          if (error) {
              // The client cannot publish.
              // You may want to notify the user.
              console.log('initPublisher error',error.name);

              if(error.name==='OT_USER_MEDIA_ACCESS_DENIED')
                  myAlert(string.s5);
              else if(error.name==='OT_SET_REMOTE_DESCRIPTION_FAILED')
                  myAlert(strings.s6);
              else if (error.name==='OT_CHROME_MICROPHONE_ACQUISITION_ERROR')
                  myAlert(strings.s7);
              else if (error.name==='OT_MEDIA_ERR_ABORTED')
                  myAlert(strings.s13);
              else if(error.code==1500)
                  myAlert(strings.s8);
              else
                  myAlert(strings.s9);
          }else{
                  console.log('initPublisher done');
            //  alert('  publisher.publishVideo(false)');
          }
          });


          publisher.on({
            VideoElementCreatedEvent: function(event){
              alert('VideoElementCreatedEvent');
              publisher.element='publisher';
            },
            accessAllowed: function (event) {
              console.log('accessAllowed');
              /*
              if(typeof(Storage) !== "undefined") {
                //  sessionStorage.publisher = publisher;
                  sessionStoragepublisher=publisher;
                  console.log('sessionStorage',publisher,sessionStorage.publisher);
               }
               */


            //  var myJSON = JSON.parse(JSON.stringify(publisher));
            //  console.log('index.js',myJSON,'--------',publisher);
              publisher.destroy();
              redirect();
              // The user has granted access to the camera and mic.
            //  alert('accessAllowed');
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


        });
  });
/*
function onclicked_(){
    var sex=document.getElementById("sex").value;
    console.log(' button clicked: '+sex);
    var pass=1;
    if(sex=="male")
        pass=0;

   // $.get("new/" + pass);
    //window.location.replace('/new/' + pass);
   window.location.href ='/new/' + pass;
}
function myFunction(browser) {
    // document.getElementById("sex").value = browser;
    console.log('myFunction: '+document.getElementById("sex").value );
}
*/
