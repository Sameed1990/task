const mongoose = require("mongoose")


const FileSchema = mongoose.Schema({
    image : {type : Array , required : true}
})

const imgModel = mongoose.model('images' , FileSchema)


module.exports = imgModel;