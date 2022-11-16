var express = require('express');
var router = express.Router();
const multer = require('multer')
const path = require("path")





// middleware 
const { CheckEnum } = require("../middleware/checkEnum")
const { CheckWeight } = require("../middleware/checkWeight")

// Schemas //
const EnumModel = require("../models/Enum")
const ProductModel = require("../models/ProductDeminision")
const WeightModel = require("../models/weight")
const ProductWeightModel = require("../models/ProductWeight")
const tagModel = require("../models/Tag")
const FileModel = require("../models/img");
const { route } = require('.');
const CartModel = require('../models/AddtoCart');

/* GET home page. */



/************************************************/
/*                    Multer                    */
/************************************************/
const Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))

  }
})

const fileFilter=(req, file, cb)=>{
  if( file.mimetype ==='image/png'){
      cb(null,true);
  }else{
      cb(null, false);
  }
 }

const multerUploads = multer({
  storage: Storage,
  limits:{
    fileSize: 1024 * 1024 * 5 // define limit 5mb max file upload size
},
  fileFilter:fileFilter

})

const upload = multerUploads.fields([{ name: "file", maxCount: 4 }])





router.post('/upload-file', upload, async (req, res) => {
  console.log("File" , req.files.file);
  var imgs = req.files.file
  try {
if(imgs){
  await new FileModel({
    image: imgs
  }).save()
    .then(data => {
      console.log(data);
      res.json({ message: "Image data send sucessfully" })
    })
}else{
  res.json({message : "invalid Extension"})
}
  

  }
  catch (error) {
    console.log(error);
    res.json({ error: "Error occured" })
  }
})

router.post('/addtocart' , async (req , res)=>{
    console.log("cart" , req.body);
    try{
        await new CartModel({
            UserId : req.body.id,
            productId : req.body.pid,
            productName : req.body.productname,
            Price : req.body.price,
            Quantity : req.body.quantity
        }).save()
        .then(data=>{
            console.log("data" , data);
            res.json({message : "Add to cart Succesfully"})
        })
    }catch(error){
        console.log(error);
        res.json({error: "data not send"})
    }
})



module.exports = router;
