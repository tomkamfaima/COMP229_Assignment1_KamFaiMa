let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

let userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

let options = ({missingPasswordError:'Wrong / Missing Password'})

userSchema.plugin(passportLocalMongoose,options);

module.exports.userSchema = mongoose.model('User', userSchema);

