const mongoose = require("mongoose");


const ProductWeightSchema = mongoose.Schema({
    productid : {type : String , required : true},
    weight : {type : mongoose.Schema.Types.ObjectId , ref : 'weights' ,  required :  true},
    unit : {type : mongoose.Schema.Types.ObjectId , ref : 'enums' ,  required :  true}
})

const ProductWeightModel = mongoose.model('product weight' , ProductWeightSchema);

module.exports = ProductWeightModel;
