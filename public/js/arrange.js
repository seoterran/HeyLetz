const strings= {
    s1: '소개팅 주선이 시작되었습니다',
    s2: '소개해주신 분의 이메일을 확인하기 위해서는 이메일을 먼저 입력해주세요',
    s3: '입력하신 이메일을 가진 회원이 존재합니다.',
    s4: '입력하신 이메일을 가진 회원이 존재하지 않습니다.',
    s5: '반드시 성별을 선택하여 주세요',
    s6: '회원가입을 환영합니다! ',
    s7: '이미 회원가입을 하셨습니다',
    s8: '잘못된 이메일 주소를 입력하셨습니다'
}; 
function resetInputClass(){
  $("input").each(function() {

     var element = $(this);
       element.removeClass('highlight');

  });
}
function validateEmail(inputText)
{
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(inputText.match(mailformat))
    return true;
  return false;
}

function checkEmailInput(){
   var isEmailValid = true;
    $(".email").each(function() {

        var element = $(this);
        var email = element.val()

        if(!validateEmail(email)){
          element.addClass('highlight');
          isEmailValid=false;
        //  return false;
        }
    });

    if (!isEmailValid)
         myAlert(strings.s8);

   return isEmailValid;
}
function checkEmptyInput(){
   var isFormValid = true;

  $("input").each(function() {

     var element = $(this);
      // console.log('input ',element.val() );
     if (element.val() == "") {
      // console.log('empty');
       element.addClass('highlight');
         isFormValid = false;
        // return false;
     }
  });

  //console.log('isFormValid',isFormValid);

   if (!isFormValid)
      myAlert('모든 항목을 빠짐없이 입력해 주세요');

   //alert("모든 항목을 빠짐없이 입력해 주세요");

   return isFormValid;
}
$(document).ready(function() {

  $('#tooltip').tooltip();
  $('#submit').click(function() {
      resetInputClass();

      if(!checkEmptyInput())
          return;
      if(!checkEmailInput())
          return;

      var persons = [];
      persons.push({
        name :  $('#name1').val(),
        email:   $('#email1').val()
      });
       persons.push({
        name :  $('#name2').val(),
        email:  $('#email2').val()
      });

      var url = '/appointment';
      $.ajax({
              url: url,
              type: 'POST',
              data: {
                'matchmaker' : {
                  'name': $('#matchmaker_name').val(),
                  'email':$('#matchmaker_email').val()
                },
                'persons': persons,
                  }, // An object with the key 'submit' and value 'true;
              success: function (result) {
              //  alert("Your bookmark has been saved");
                console.log(result);
                var msg=   strings.s1;
                myAlert(msg);
              },
              error:   function(jqXHR, textStatus, errorThrown) {
                  alert("Error, status = " + textStatus + ", " +
                        "error thrown: " + errorThrown
                  );
              }
          });
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
