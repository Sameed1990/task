const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
    name : {type : String  , required : true},
    description : {type : String , required : true},
    img : {type : String , required : true}
})

const tagModel = mongoose.model('tag' , tagSchema);

module.exports = tagModel;