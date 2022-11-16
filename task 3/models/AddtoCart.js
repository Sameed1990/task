const mongoose = require("mongoose");


const CartSchema = mongoose.Schema({
    UserId: {type : mongoose.Schema.Types.ObjectId, ref: "users", required : true},
    productId: {type : mongoose.Schema.Types.ObjectId, ref:'products' , required :  true},
    productName: {type : String , required : true},
    Price: {type : Number , required : true},
    Quantity: {type : Number , required : true}
})

const CartModel = mongoose.model('cart' , CartSchema);

module.exports = CartModel;