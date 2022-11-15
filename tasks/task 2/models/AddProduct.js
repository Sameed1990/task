const mongoose = require("mongoose");


const ProductSchema = mongoose.Schema({
    ProductName: { type: String, required: true },
    ProductCategory: { type: String, required: true },
    Price: { type: Number, required: true },
    Quantity: { type: Number, required: true },
    // Productimg: { type: String, required: true },
    Details: { type: String, required: true }
})

const ProductModel = mongoose.model('products', ProductSchema)

module.exports = ProductModel;