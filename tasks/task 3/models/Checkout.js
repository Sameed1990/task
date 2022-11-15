const mongoose = require("mongoose")

const CheckOutSchema = mongoose.Schema({
    // UserId : {type : mongoose.Schema.Types.ObjectId , required : true}
    UserId : {type : String , required : true},
    FullName : {type : String ,  required : true},
    Email : {type : String ,  required : true},
    Phone : {type : Number ,  required : true},
    Country : {type : String ,  required : true},
    StreetAddress1:{type : String ,  required : true},
    StreetAddress2:{type : String ,  required : true},
    City : {type : String ,  required : true},
    State : {type : String ,  required : true},
    ZipCode : {type : Number ,  required : true},
    OrderNotes : {type : String},
    PaymentMethod : {type : String ,  required : true},
    PaymentStatus : {type : String ,  required : true ,  default : "Unpaid"},
    Date : {type : Number , required : true , default : Date.now()},
    promoCode : {type : String },
    Orderid : {type : Number ,  required : true},
    Statue : {type : String ,  default : "Pending"},
    Subtotal : {type : Number ,  required : true},
    Productids : {type : Array , required : true}

})


const CheckOutModel = mongoose.model('orders' , CheckOutSchema);


module.exports = CheckOutModel;