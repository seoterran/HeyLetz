const strings= {
    s1: '앗 아직 Heyletz 회원이 아니세요. 회원가입을 먼저 해주세요',
    s2: '소개해주신 분의 이메일을 확인하기 위해서는 이메일을 먼저 입력해주세요',
    s3: '입력하신 이메일을 가진 회원이 존재합니다.',
    s4: '입력하신 이메일을 가진 회원이 존재하지 않습니다.',
    s5: '반드시 본인의 성별을 선택하여 주세요',
    s6: '회원가입을 환영합니다! ',
    s7: '이미 회원가입이 되어있습니다'
}; 
var current_url= window.location.host;
var appID;
var local = false;

if(current_url.includes("localhost")) {
   console.log('local',current_url,window.location.protocol);
   appID='257794311410730';
   local=true;
}else if(current_url.includes("quiet-chamber")){
   console.log('staging',current_url,window.location.protocol);
   appID='258268861349318';
}else{
   console.log('production',current_url,window.location.protocol);
   appID='1931460180439762';
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : appID,
        xfbml      : true,
        version    : 'v2.11'
    });
    FB.AppEvents.logPageView();
    /*
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
    */
    /*
    var finished_rendering = function() {
      console.log("finished rendering plugins");
      var spinner = document.getElementById("spinner");
      spinner.removeAttribute("style");
      spinner.removeChild(spinner.childNodes[0]);
    }
    FB.Event.subscribe('xfbml.render', finished_rendering);
    */
};
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/*
window.fbAsyncInit = function() {
    FB.init({
        appId      : '258268861349318', //dev
        //appId      : '1931460180439762',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.10'
    });
    FB.AppEvents.logPageView();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
*/
/*
function setUpCollege(){
  var select = document.getElementById('college');

  for (var i = 0; i<=3; i++){
      var opt = document.createElement('option');
      opt.value = i;
      opt.innerHTML = i;
      select.appendChild(opt);
  }

  select.value = 2018;//new Date().getFullYear();

}
*/



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
 Bind listeners when the page loads.

(() => {
    document.getElementById('file-input').onchange = initUpload;
})();
*/


$(document).ready(function() {
    if(!found)
       myAlert(strings.s1);


    //console.log('createLoginButton');
    Kakao.init('71cdcc100c74d63a58378236762320d9');
    Kakao.Auth.createLoginButton({
      container: '#custom-login-btn',
      size: 'small',
      success: function (authObj) {
          console.log('createLoginButton success');
          Kakao.API.request({
            url: '/v1/user/me',
            success: function(res) {
              console.log(JSON.stringify(res),res.properties.nickname,res.kaccount_email);

              var valid = validate();
              if(!valid) return;

              var response={
                name : res.properties.nickname,
                email: res.kaccount_email,
                id: res.id
              }
              redirect(response);
            },
            fail: function(error) {
            //  alert(JSON.stringify(error));
            }
          });
      },
  });

    $('[data-toggle="tooltip"]').tooltip();

    var max = 2003;
    var min = max-20;
    //var select = document.getElementById('admission');
    var select = document.getElementById('age');

    for (var i = min; i<=max; i++){
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        select.appendChild(opt);
    }

    select.value = 2018;//new Date().getFullYear();


    $('#checkRefEmail').click(function() {
        var refEmail=$('#refEmail').val();
        if(refEmail.length==0){
           //   alert('추천자 이메일을 입력해주세요');
           myAlert(strings.s2,null);
           return;
        }
        var url = '/user/checkEmail';
        $.ajax({
                url: url,
                type: 'POST',
                data: {'refEmail': refEmail}, // An object with the key 'submit' and value 'true;
                success: function (result) {
                //  alert("Your bookmark has been saved");
                  console.log(result);
                  var msg= result.found?
                      strings.s3:
                      strings.s4;
                  myAlert(msg);
                },
                error:   function(jqXHR, textStatus, errorThrown) {
                    alert("Error, status = " + textStatus + ", " +
                          "error thrown: " + errorThrown
                    );
                }
            });
      //  alert('clicked:'+refEmail);
      /*
      var posting = $.post( url, { refEmail: refEmail} );

      // Put the results in a div
      posting.done(function( data ) {
          alert(data.found);
      //  var content = $( data ).find( "#content" );
      //  $( "#result" ).empty().append( content );
      });
      $.post( "/user/checkEmail", { refEmail: refEmail }, function( data ) {
          alert( data.found ); // John
    //      console.log( data.time ); // 2pm
        }, "json");

            */

    });



});

function myAlert(msg,data){
    $('#modal_text').text(msg);
    $('#myModal').modal('show');
    if(data){
      $("#myModal").on("hide.bs.modal", function () {
          window.location = data.redirect;
      });
    }
}

function validate(){
    var male=$('#male_radio').is(':checked');
    var female=$('#female_radio').is(':checked');

    console.log('validate',male,female);

    if(!male&&!female){
        myAlert(strings.s5);
        return false;
    }



  /*
    var empty = true;
    $('input[type="text"]').each(function(){ //not working
        if($(this).val()!=""){
            empty =false;
        }
    });
    if(!empty){
      alert('모든 사항을 빠짐없이 입력해 주세요');
      return false;
    }
    */
    return true;
}

function checkLoginState() {
    var valid = validate();
    if(!valid) return;

    FB.login(function(response) {
        statusChangeCallback(response);
    }, {scope: 'email'});
    /*
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
    */
}

function redirect(response){
    var  male = $('#male_radio').is(':checked'),
          female = $('#female_radio').is(':checked'),

    //    admission = $('#admission :selected').val(),

          age = $('#age :selected').val(),
/*
          school = $('#college').val(),
          major = $('#major').val(),
          selfIntro = $('#selfIntro').val(),
          career = $('#career').val(),
          hobby = $('#hobby').val(),
          collegeEmail = $('#collegeEmail').val()+$('#collegeDomain').text(),
            refEmail = $('#refEmail').val(),
            */

          contact = $('#contact').val(),
          promoCode = $('#promoCode').val(),

          name=response.name,
          email=response.email,
          sid=response.id;

/*
    if(!male && !female){
        alert('반드시 성별을 선택하여 주세요');
        return;
    }
*/
    var gender = male ? 0 : 1;
    /*
    alert(JSON.stringify(response.authResponse)+'/'+
        sid+'/'+
        email+'/'+
        name);
    */



    console.log('sign up button clicked',name,email,sid);//JSON.stringify(response));
    //return;
    $.post( "/user/create", {
        sid: sid,
        gender :gender,
        name:name,
        age:age,
      //  admission:admission,
/*
        school:school,
        major:major,
        hobby : hobby,
        career : career,
        selfIntro : selfIntro,
          collegeEmail:collegeEmail,
            refEmail:refEmail
        */
        promoCode : promoCode,
        email:email,
        contact:contact,

    },function(data, status){

      //  if (typeof data.redirect == 'string'){
      if(data.found==false){
            //alert("Data: " + data + "\nStatus: " + status);
          myAlert(strings.s6+name+'님',data);
      }else {
          myAlert(strings.s7,data);
      }
    });
}


    // 카카오 로그인 버튼을 생성합니다.
function loginWithKakao2() {

   var valid = validate();
   if(!valid) return;

    console.log('signupWithKakao');

    Kakao.Auth.login({
          success: function(authObj) {
              //console.log(JSON.stringify(authObj));
            Kakao.API.request({
              url: '/v1/user/me',
              success: function(res) {
                console.log(JSON.stringify(res),res.properties.nickname,res.kaccount_email);
                var response={
                  name : res.properties.nickname,
                  email: res.kaccount_email,
                  id: res.id
                }
                redirect(response);
              },
              fail: function(error) {
              //  alert(JSON.stringify(error));
              }
            });
          },
          fail: function(err) {
          //  alert(JSON.stringify(err));
          }
    });

};

function statusChangeCallback(response){
    if(response.status!=='connected')
        return;

  //  var sid=response.authResponse.userID;
    console.log('statusChangeCallback',JSON.stringify(response));
    var url = '/me?fields=id,name,email';
    FB.api(url, function(response) {
        redirect(response);
     }, {scope: 'email'});
     /*
    //FB.login(function(response) {
    FB.api('/me', function(response) {
      //  console.log('Good to see you, ' + response.name + '.');
        temp(response,sid);
    });*/
}

/*function checkRefEmail2(){
    console.log('checkRefEmail');
    var refEmail=$('#refEmail').val();
    if(refEmail.length==0){
       alert('추천자 이메일을 입력해주세요');
       return;
    }

    $.post( "/user/checkEmail", {
        refEmail: refEmail
    },function(data, status){
        console.log(data);
        var msg= data.found?
            '존재하는 회원입니다':
            '존재하지 않는 회원입니다';
        alert(msg);
    });
  //  return;

}*/


//});
