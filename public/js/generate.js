const strings= {
    s7: '초대 번호 생성, 이메일 보냄',
    s8: '---'
}; 

function isIdValid(katokId, email){
  var url = '/invite/generate/id/'+katokId+'/'+email;
  $.ajax({
       url: url,
       type: 'GET',
       success: function (result) {
         //  alert("Your bookmark has been saved");
           //console.log('checkTimeFromServer',sid,result.valid);
           if( result.valid ){
              console.log('isIdValid',result);
              myAlert(strings.s7+'/'+result.inviteId,null);
           }else {
              myAlert(strings.s8,null);
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

$(document).ready(function() {

    $('#generate').click(function() {
        console.log('clicked');
        var email=$('#email').val();
        var katokId=$('#katokId').val();
        if(email.length==0 || katokId.length==0){
           //   alert('추천자 이메일을 입력해주세요');
           myAlert(strings.s2,null);
           return;
        }
        isIdValid(katokId,email);
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
