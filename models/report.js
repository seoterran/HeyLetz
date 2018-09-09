const mongoose = require('mongoose'),
    Schema = mongoose.Schema({
        reporter: {
            userId :String,
            gender : Number
        } ,
        partner:{
            userId :String,
            gender : Number
        },
        sessionId: String,
        choice: Number,
        text: String
    });
module.exports = mongoose.model('Report', Schema);
