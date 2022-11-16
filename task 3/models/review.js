const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
    productID:     { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },    
    userID:      { type: mongoose.Schema.Types.ObjectId, ref: 'users',  required: true },       
    stars:     { type: Number, required: true, min: 1, max: 5 },                                 
    text:      { type: String, required: true },               
    timestamp: { type: Number, required: true },
  })

  const reviewmodel = mongoose.model('review' , reviewSchema)


  module.exports = reviewmodel;