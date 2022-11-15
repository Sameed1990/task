var express = require('express');
var router = express.Router();
const multer = require('multer')
const path = require("path")
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;




// middleware 


// Schemas //
const FileModel = require("../models/img")
const CartModel = require('../models/AddtoCart');
const ProductModel = require('../models/AddProduct');

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

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const multerUploads = multer({
  storage: Storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // define limit 5mb max file upload size
  },
  fileFilter: fileFilter

})

const upload = multerUploads.fields([{ name: "file", maxCount: 4 }])




/************************************************/
/*               Add Product                    */
/************************************************/

router.post('/add-product', upload, async (req, res) => {
  console.log("Product", req.body);
  // console.log("File", req.files.file);
  // var imgs = req.files.file

  try {
    await new ProductModel({
      ProductName: req.body.ProductName,
      ProductCategory: req.body.ProductCategory,
      Price: req.body.Price,
      Quantity: req.body.Quantity,
      // Productimg: imgs,
      Details: req.body.Details
    }).save()
      .then(data => {
        console.log(data);
        res.json({ message: "Product add succesfully" })
      })
  } catch (error) {
    console.log(error);
    res.json({ error: "internel server error" })
  }

})






/************************************************/
/*             Add to Cart                      */
/************************************************/



router.post('/addtocart', async (req, res) => {
  console.log("cart", req.body);
  const find = await CartModel.find({ UserId: req.body.UserId, productId: req.body.productId })
  console.log(find);
  try {
    if (find.length == 0) {
      await new CartModel({
        UserId: req.body.UserId,
        productId: req.body.productId,
        productName: req.body.productName,
        Price: req.body.Price,
        Quantity: req.body.Quantity
      }).save()
        .then(data => {
          console.log("data", data);
          res.json({ message: "Add to cart Succesfully" })
        })
    } else {
      await CartModel.updateOne({
        UserId: req.body.UserId,
        $inc: { Quantity: parseInt(req.body.Quantity) }
      })
      res.json({ message: "product update succesfully" })
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "data not send" })
  }
})





/************************************************/
/*             Update From Cart                 */
/************************************************/
router.post('/update-item/:_id/:act', async (req, res) => {

  console.log(req.params.act, req.params._id);
  try {
    let action = 1
    if (req.params.act == "sub") {
      action = -1
    } else {
      action = 1
    }
    await CartModel.findOneAndUpdate({
      _id: ObjectId(req.params._id)
    }, {
      $inc: { Quantity: action }
    }
    ).then(data => {
      console.log("update", data);
      res.json({ message: "data update sucessfully" })
    })
  } catch (error) {
    console.log(error);
    res.json({ error: "not update" })

  }


})





/************************************************/
/*             Remove From Cart                 */
/************************************************/

router.post('/remove-item/:id', async (req, res) => {
  console.log("Id", req.params.id);
  try {
    const find = await CartModel.findOneAndRemove({
      _id: ObjectId(req.params.id)
    }).then(async data => {
      console.log(data);
      res.json({ message: "Product Remove sucesfully" })
    })

  } catch (error) {
    console.log(error);
    res.json({ error: "internal server error" })
  }
})




/************************************************/
/*             Upload An Image                  */
/************************************************/


router.post('/upload-file', upload, async (req, res) => {
  console.log("File", req.files.file);
  var imgs = req.files.file
  try {
    if (imgs) {
      await new FileModel({
        image: imgs
      }).save()
        .then(data => {
          console.log(data);
          res.json({ message: "Image data send sucessfully" })
        })
    } else {
      res.json({ message: "invalid Extension" })
    }


  }
  catch (error) {
    console.log(error);
    res.json({ error: "Error occured" })
  }
})



module.exports = router;
