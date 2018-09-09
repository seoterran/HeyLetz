const strings= {
    s1: '앗 아직 Heyletz 회원이 아니세요. 회원가입을 먼저 해주세요.',
    s2: '초대번호와 카톡아이디를 모두 입력해 주세요.',
    s3: '초대장을 받으실 이메일을 입력해 주세요.',
    s4: '로 초대장 신청 링크를 보내드렸습니다.',
    s8: '입력하신 초대번호와 카톡아이디가 정확하지 않습니다.'
}; 

function isIdValid(inviteId,katokId){
    var url = '/invite/checkInviteId/'+inviteId+'/'+katokId;
    $.ajax({
       url: url,
       type: 'GET',
       success: function (result) {
         //  alert("Your bookmark has been saved");
           //console.log('checkTimeFromServer',sid,result.valid);
           if(result.valid){
              window.location.href = '/signup/'+katokId;
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

  return true;
}
$(document).ready(function() {

    if(!found)
       myAlert(strings.s1);

    $('[data-toggle="tooltip"]').tooltip();

    $('#submitId').click(function() {
        console.log('clicked');
        var inviteId=$('#inviteId').val();
        var katokId=$('#katokId').val();
        if(inviteId.length==0 || katokId.length==0){
           //   alert('추천자 이메일을 입력해주세요');
           myAlert(strings.s2,null);
           return;
        }
        isIdValid(inviteId,katokId);
    });

    $("#request").click(function(event){
      //  $("#emailInput").val(o;
        myConfirm(strings.s3);
    });

    $("#confirm_btn_yes").click(function(event){
          var newEmail=$("#emailInput").val();
      //    console.log('yes clicked',obj.email,newEmail);

          $.ajax({
             url: "/invite/"+newEmail,
             type: 'GET',
             success: function (result) {
               //  alert("Your bookmark has been saved");
                 //console.log('checkTimeFromServer',sid,result.valid);
                 if(result.done){
                    myAlert('감사합니다! 입력해 주신 '+newEmail+' '+strings.s4,null);
                    $("#emailInput").val('');
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

    });

});
function myConfirm(msg){
   $("#confirm_text").text(msg);
   $("#myConfirm").modal();
}

function myAlert(msg,data){
    $('#modal_text').text(msg);
    $('#myModal').modal('show');
    if(data){
      $("#myModal").on("hide.bs.modal", function () {
          window.location = data.redirect;
      });
    }
}
