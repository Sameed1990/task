const mongoose = require("mongoose");


const ProductSchema = mongoose.Schema({
    productid : {type : String , required : true},
    width : {type : String , required : true},
    height : {type : String , required : true},
    unit : {type : mongoose.Schema.Types.ObjectId , ref : 'enums' ,  required :  true}
})

const ProductModel = mongoose.model('Products' , ProductSchema);

module.exports = ProductModel;
