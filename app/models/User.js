const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    username: String,
    name: String,
    age: Number,
    password: String
});

module.exports = function(){
    return mongoose.model('users', userSchema);
}