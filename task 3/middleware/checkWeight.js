const WeightModel = require("../models/weight");



module.exports  = {
    CheckWeight : async function (req , res , next) {
        const findVal = await WeightModel.find({ weight : req.body.weight })
        console.log("validation" , findVal);
        if(findVal.length > 0){
            return res.json({Alert : "Weight Already Exist"})
        }
        else{
            next()
        }
    }

}