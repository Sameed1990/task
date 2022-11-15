const EnumModel = require("../models/Enum")


module.exports  = {
    CheckEnum : async function (req , res , next) {
        const findVal = await EnumModel.find({ Enum : req.body.Enum })
        console.log("validation" , findVal);
        if(findVal.length > 0){
            return res.json({Alert : "Enum Already Exist"})
        }
        else{
            next()
        }
    }

}