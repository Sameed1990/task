const mongoose = require("mongoose");

const promoSchema = mongoose.Schema({
    promoCode : {type : String ,  required : true},
    discount : {type : Number , required : true}
})

const promoModel = mongoose.model('promo-code' , promoSchema)

module.exports = promoModel;