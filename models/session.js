const mongoose = require('mongoose'),
      Schema = mongoose.Schema({
          sessionId: String,//mongoose.Schema.Types.ObjectId,
          OTsessionId : {
             type: String,
             default: null
           },
          male: {
              userId: String,
              ilike: Number,
              email: String,
              contact: String
          },
          female: {
              userId: String,
              ilike: Number,
              email: String,
              contact: String
          },
          type: Number,
          date: Date,
          stage: Number
      });
module.exports = mongoose.model('Session', Schema);
// Export function to create "SomeModel" model class
/*

ilike
0:
1: round 1 i like
2: round 2 i like


stage
0:
1: round 1 start
2: round 1 end
3: round 2 start
4: round 2 end
5: matched

 */
