const mongoose = require('mongoose'),
      Schema = mongoose.Schema({
          inviteId: String,
          katokId: String,
          email: String,
          date: { type: Date, default: Date.now },
          accepted:{ type: Boolean, default: false }
      });
module.exports = mongoose.model('Invite', Schema);

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
