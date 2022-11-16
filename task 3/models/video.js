const mongoose = require("mongoose");

const videoSchema = mongoose.Schema({
    video : {type : Array , required : true}
})

const videoModel = mongoose.model('video' , videoSchema)

module.exports = videoModel;