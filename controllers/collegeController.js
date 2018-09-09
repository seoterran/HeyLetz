

const config = require('../config'),
      test = config.test,
      express = require('express'),
      router = express.Router(),
  //    appointment_controller = require('../controllers/appointmentController'),
      email_controller = require('../controllers//emailController'),
      tweengle_email=config.mail.tweengle_email,
    //  uuidv4 = require('uuid/v4'),

      XLSX = require('xlsx');
    //  user_controller = require('../controllers/userController');
  //  console.log('XLSX start');


    var workbook = XLSX.readFile('colleges.xlsx');
    var sheet_name_list = workbook.SheetNames;
    var ss=XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])

    console.log('XLSX done');

router.get('/major/:college/', function(req, res) {

       var college=req.params.college;

       var mj=[];
       for(var z of ss){
         if(z.__EMPTY_4 === college){
            // console.log(z.__EMPTY_4,z.__EMPTY_7);
            if(z.__EMPTY_10 !== '폐과')
             mj.push(z.__EMPTY_7);
           }
       }
       res.json(mj);
});

router.get('/names', function(req, res) {

       var prev_college;
       var mj=[];
       for(var z of ss){
          var cur_college = z.__EMPTY_4;
          if(prev_college!==cur_college){
            mj.push(cur_college);
            prev_college = cur_college;
          }
       }
       res.json(mj);
});

module.exports = router;
