const mongoose = require("mongoose");


const CartSchema = mongoose.Schema({
    UserId: {type : String , required : true},
    productId: {type : String , required :  true},
    productName: {type : String , required : true},
    Price: {type : Number , required : true},
    Quantity: {type : Number , required : true}
})

const CartModel = mongoose.model('cart' , CartSchema);

module.exports = CartModel;