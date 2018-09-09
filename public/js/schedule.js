
const strings= {
    s1: '소개팅 가능 날짜가 입력되었습니다. 상대분과 조율후 소개팅 가능 일을 알려드리겠습니다',
    s8: '---'
}; 
const maxDates = 7

$(function () {

    var contact = $('#contact').val();

    const today = new Date().getDate();
    var startDate = new Date();
    startDate.setDate(today + 1);
    var endDate = new Date();
    endDate.setDate(today + maxDates+1);

    let dates= [];

    //var i;
    for(let i=1 ; i<=maxDates ; i++){
      var date = new Date();

      date.setDate(today + i);
      dates.push(date);
      console.log('date',today,date);
    }

    console.log('dates',dates);

    var datepicker = $('.datepicker').datepicker({
    //  format: 'mm/dd/yyyy',
      format: 'YYYY-MM-DD' ,
      startDate: startDate,
      endDate: endDate,
      multidate: true,
      pickTime: false
    }).datepicker('setDates', dates);

    $('#submit').click(function() {
      var appointId = obj.appointId;
      var personId = obj.personId;
      var url = '/appointment/availability';
      var availability = datepicker.datepicker('getDates');
      console.log('availability',availability);

      $.ajax({
              url: url,
              type: 'POST',
              data: {
                'appointId' : appointId,
                'personId': personId,
                'availability' :availability,
                'contact': contact
                  }, // An object with the key 'submit' and value 'true;
              success: function (result) {
              //  alert("Your bookmark has been saved");
                console.log(result);
                if(result.submitted){
                  var msg=   strings.s1;
                  myAlert(msg);
                }
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
