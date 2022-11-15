const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require("path")
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;




// middleware 


// Schemas //
const FileModel = require("../models/img")
const CartModel = require('../models/AddtoCart');
const CheckOutModel = require('../models/Checkout');
const ProductModel = require('../models/AddProduct');
const reviewmodel = require('../models/review');
const userModel = require('../models/users');

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
/*                 Users                        */
/************************************************/
router.post('/add-users', async (req, res) => {
  console.log(req.body);

  try {
    await new userModel({
      userName: req.body.userName,
      password: req.body.password
    }).save()
      .then(data => {
        console.log(data);
        res.json({ message: "users add succesfully" })
      })
  } catch (error) {
    console.log(error);
    res.json({ error: "user not add" })
  }
})


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







/************************************************/
/*                 CheckOut                     */
/************************************************/
router.post('/checkout', async (req, res) => {
  console.log("Body", req.body);
  let value = 0;
  let productsids = [];
  const find = await CartModel.find({ UserId: req.body.UserId })
  console.log("ID", find);

  const find1 = await CartModel.find({ UserId: req.body.UserId })
  console.log("Products", find1);
  let subtotal;

  for (let i = 0; i <= find1.length - 1; i++) {
    // subtotal = find1[i].Price
    productsids.push(find1[i]._id)
    value += parseFloat(find1[i].Price)
    console.log("loop", value);
  }

  let count = await CheckOutModel.countDocuments({})
  console.log("count", count);
  count += 1


  if (req.body.PaymentMethod == "Card" || req.body.PaymentMethod == "Paypal") {
    PaymentStatus = "Paid"
  } else {
    PaymentStatus = "Unpaid"
  }
  if (find.length > 0) {
    try {
      await new CheckOutModel({
        UserId: req.body.UserId,
        FullName: req.body.FullName,
        Email: req.body.Email,
        Phone: req.body.Phone,
        Country: req.body.Country,
        StreetAddress1: req.body.StreetAddress1,
        StreetAddress2: req.body.StreetAddress2,
        City: req.body.City,
        State: req.body.State,
        ZipCode: req.body.ZipCode,
        OrderNotes: req.body.OrderNotes,
        PaymentMethod: req.body.PaymentMethod,
        PaymentStatus: PaymentStatus,
        promoCode: req.body.promoCode,
        Orderid: count,
        Subtotal: value,
        Productids: productsids
      }).save()
        .then(data => {
          console.log("data", data);
          res.json({ Sucess: "Order Placed Successfully" })
        })
        .catch(e => console.log(e))

    }
    catch (error) {
      console.log(error);
      res.json({ error: "CheckOut Failed" })
    }
  }
})



/************************************************/
/*                 Place Order                  */
/************************************************/
router.get('/place-order/:orderid?', async (req, res) => {

  const id = req.params.orderid

  const find = await CheckOutModel.find({ Orderid: id })
  console.log(find);

  res.json({
    OrderNumber: find.Orderid,
    OrderPlacment: find.Date,
    Status: find.Status,


  })


})



/************************************************/
/*                   Review                     */
/************************************************/

router.post('/add-review', async (req, res) => {
  console.log("review", req.body);

  try {
    await new reviewmodel({
      productID: ObjectId(req.body._id),
      userID: req.body.userID,
      stars: req.body.stars,
      text: req.body.text,
      timestamp: Date.now(),
    }).save()
      .then(data => {
        console.log("review", data);
        res.json({ message: "review add successfully" })
      })
  } catch (error) {
    console.log(error);
    res.json({ error: "review add faild" })
  }
})

/************************************************/
/*                   Get Review                 */
/************************************************/
router.get('/reviews', async (req, res) => {
  const find = await reviewmodel.find({})
  console.log("reviews", find);
  if (find.length > 0) {
    res.json({ data: find })
  } else {
    res.json({ message: "No data found" })
  }
})

/************************************************/
/*            Get Review By UserId              */
/************************************************/
router.get('/reviews-by-user/:userID?' ,  async (req , res)=>{
  console.log("params", req.params.userID);
  const find = await reviewmodel.find({ userID: req.params.userID })

    .then(data => {
      console.log(data);
      res.json({ findByUserID: data })
    })
    .catch(err => {
      console.log(err);
      req.json({ error: "data not get due to error" })
    })
})


/************************************************/
/*            Get Review By productID           */
/************************************************/
router.get('/reviews-by-product/:productid?', async (req, res) => {
  console.log("params", req.params.productid);
  const find = await reviewmodel.find({ productID: req.params.productid })

    .then(data => {
      console.log(data);
      res.json({ findByProductis: data })
    })
    .catch(err => {
      console.log(err);
      req.json({ error: "data not get due to error" })
    })
})


/************************************************/
/*               Remove Review                  */
/************************************************/
router.post('/remove-review' ,  async (req , res)=>{
  try {
    const find = await reviewmodel.findByIdAndRemove({_id : req.body._id})
    res.json({message : "Review Remove successfully"})
  } catch (error) {
    console.log(error);
    res.json({error : "error occured"})
  }
})



module.exports = router;