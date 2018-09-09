const mongoose = require('mongoose'),
      Schema = mongoose.Schema({
          name: String,
          school: String,
           major: String,
        //    adms: Number,
          selfIntro:String,
          idealType:String,
          hobby:String,
          career:String,
          age:Number,
          collegeEmail: String,
          email:String,
          contact: String,
          refEmail:String,
          signup:Date,
          lastLogin:Date,
          visit: Number,
          gender: Number,
          sid: Number,
          credit: Number,
          auth:{
             type:Boolean,
             default : false
           }
      });

module.exports = mongoose.model('User', Schema);

// Export function to create "SomeModel" model class
/*
Schema.methods.speak = function () {
        var greeting = this.name
            ? 'My name is ' + this.name
            : "I don't have a name";
        console.log(greeting);
    };
*/

//var silence = new User({ name: 'Silence' });
//console.log(silence.name);
