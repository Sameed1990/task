const mongoose = require("mongoose");

const WeightSchema = mongoose.Schema({
    weight : {type : String , requird : true}
})

const WeightModel = mongoose.model('weight' , WeightSchema);

module.exports = WeightModel;