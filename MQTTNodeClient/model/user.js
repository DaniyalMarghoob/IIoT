var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: {type:String,required:true,unique:true},
    password: {type:String},
    admin:    {type: Boolean, default: false}
});
User.methods.getUserName = function() {
    return (this.username);
};
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
