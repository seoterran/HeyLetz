function submit(){

    var choice=$("input[name='report']:checked").val();
    var other=$("#other").val();
    if(typeof choice === "undefined") {
      myAlert('아무것도 선택하지 않으셨습니다.');
      return;
    }

    //alert('submit'+choice);
    var msg={
        reporter :{
            userId:reporter_userId,
            gender:reporter_gender
        },
        partner : {
            userId:partner_userId,
            gender:partner_gender
        },
        sessionId: sessionId,
        choice: choice,
        text: other
    };

    //alert(msg.partner.gender+'/'+msg.reporter.userId+'/'+msg.sessionId);

    $.post( "/report", msg, function(data, status){
        //alert('피드백 감사드립니다!');
        myAlert('피드백 감사드립니다!');
    });

}
function myAlert(msg){
   //console.log(myAlert,msg);
   $("#modal_text_report").text(msg);
   $("#myModal_report").modal();
}

$("#myModal_report").on("hide.bs.modal", function () {
    // put your default event here
    window.location.href = '/';
});
