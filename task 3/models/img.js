const mongoose = require("mongoose")


const FileSchema = mongoose.Schema({
    image : {type : Array , required : true}
})

const FileModel = mongoose.model('image' , FileSchema)


module.exports = FileModel;