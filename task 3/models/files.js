const mongoose = require("mongoose")


const FileSchema = mongoose.Schema({
    image : {type : Array , required : true},
    video : {type : Array , required : true}
})

const fileModel = mongoose.model('files' , FileSchema)


module.exports = fileModel;