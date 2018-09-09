const mongoose = require('mongoose'),
      Schema = mongoose.Schema({
          matchmaker : { name: String, email: String },
          persons: [{
            name: String,
            email: String,
            contact : String,
            iLikeHimOrHer:{
              type: Number ,
              default : 0
            },
            availability:{
               type: [Date] ,
               default : null
             }
          }],
          createdDate : {
             type: Date,
             default: Date.now
            },
          appointmentDate : Date,
          OTsessionId : {
             type: String,
             default: null
           },
           like :{
              type: String,
              default: 0
            },
          status :{ type: Number, default: 0 }
      });
module.exports = mongoose.model('Appointment', Schema);
