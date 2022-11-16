const mongoose = require("mongoose")


const EnumSchema = mongoose.Schema({
    Enum : {type : String , required : true}
})

const EnumModel = mongoose.model('Enum' , EnumSchema)


module.exports = EnumModel;