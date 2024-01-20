const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    name:String,
    email:String,
    picture:String,
    password:String
    
})

module.exports = mongoose.model('user',userschema)