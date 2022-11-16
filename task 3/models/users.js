const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
    userName : {type : String ,  required : true},
    password : {type : String , required : true}
})

const userModel = mongoose.model('users' , usersSchema)

module.exports = userModel;