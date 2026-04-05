const mongoose = require('mongoose');
const Schema = mongoose.Schema ({
    name : string,
    email : string,
    password : string,
    isvarified :{type: boolean, default: false},
    varificationToken : string,
    resetToken : string,
    resetTokenExpire : date
})
module.exports = mongoose.model('user', Schema)