const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require("path")
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;




// middleware 


// Schemas //
const imgModel = require("../models/img")
const CartModel = require('../models/AddtoCart');
const CheckOutModel = require('../models/Checkout');
const ProductModel = require('../models/AddProduct');
const reviewmodel = require('../models/review');
const userModel = require('../models/users');
const promoModel = require('../models/promo');
const videoModel = require("../models/video")
const fileModel = require("../models/files")

/* GET home page. */

router.get('/products', async (req, res) => {
  const find = await ProductModel.find({});
  res.json({ data: find })
})

router.get('/', async (req, res) => {
  res.render('index')
})

/************************************************/
/*                   Multer                     */
/************************************************/



const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => { // setting destination of uploading files        
    if (file.fieldname === "video") { // if uploading video
      cb(null, './public/videos/');
    } else { // else uploading image
      cb(null, './public/uploads/');
    }
  },
  filename: (req, file, cb) => { // naming file
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") { // if uploading video
    if (file.mimetype === 'video/mp4') { // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else { // else uploading image
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) { // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
};

const upload = multer(
  {
    storage: fileStorage,
    limits:
    {
      fileSize: '2mb'
    },
    fileFilter: fileFilter
  }
).fields(
  [
    {
      name: 'video',
      maxCount: 1
    },
    {
      name: 'image',
      maxCount: 1
    }
  ]
)



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
      Details: req.body.Details,
      image: req.files.image,
      video: req.files.video
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
/*                 Update Product               */
/************************************************/
router.post('/update-product/:id?', upload, async (req, res) => {
  console.log(req.params.id);
  try {
    const update = ProductModel.findOneAndUpdate({ _id: req.params.id }, {
      ProductName: req.body.ProductName,
      ProductCategory: req.body.ProductCategory,
      Price: req.body.Price,
      Quantity: req.body.Quantity,
      Details: req.body.Details,
      image: req.files.image,
      video: req.files.video
    }).then(data => {
      console.log(data);
      res.json({ message: "product update succesfully" })
    })
  } catch (error) {
    console.log(error);
    res.json({ err: "error" })
  }
})

/************************************************/
/*                Delete Product                */
/************************************************/
router.post('/delete-product/:id?', async (req, res) => {
  console.log(req.params.id);
  try {
    const find = ProductModel.findOneAndDelete({ _id: req.params.id })
      .then(data => {
        console.log(data);
        res.json({ message: "product delete  succesfully" })
      })
  } catch (error) {
    console.log(error);
    res.json({ err: "error" })
  }
})
/************************************************/
/*             Delete Video and Image           */
/************************************************/
router.post('/remove-product-files/:id?', async (req, res) => {
  console.log(req.params.id);
  try {
    const find = ProductModel.findOneAndUpdate({ _id: req.params.id }, { $unset: { image: "", video: "" } })
      .then(data => {
        console.log(data);
        res.json({ message: "feild remove succesfully" })
      })
  } catch (error) {
    console.log(error);
    res.json({ err: "error" })
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
router.post('/upload-file', async (req, res) => {
  console.log("File", req.files.file);
  var imgs = req.files.file
  try {
    if (imgs) {
      await new imgModel({
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
/*             Upload An Video                  */
/************************************************/
router.post('/upload-video', async (req, res) => {
  console.log("File", req.files.files);
  var video = req.files.files
  try {
    if (video) {
      await new videoModel({
        video: video
      }).save()
        .then(data => {
          console.log(data);
          res.json({ message: "video data send sucessfully" })
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
/*             Upload Files                     */
/************************************************/
router.post('/upload-files', upload, async (req, res) => {
  console.log("Files", req.files.file, req.files.file);
  try {
    await new fileModel({
      image: req.files.image,
      video: req.files.video
    }).save()
      .then(data => {
        console.log(data);
        res.json({ success: "file upload succesfully" })
      })
  } catch (error) {
    console.log(error);
    res.json({ error: "file not send due to some error" })

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
  // SUBTOTAL
  const find1 = await CartModel.find({ UserId: req.body.UserId })
  console.log("Products", find1);
  for (let i = 0; i <= find1.length - 1; i++) {
    // subtotal = find1[i].Price
    productsids.push(find1[i]._id)
    value += parseFloat(find1[i].Price)
  }
  console.log("loop", value);
  //TOTAL AMOUNT
  let totalAmount = value;

  // //PROMO CODE
  const discount = await promoModel.find({ promoCode: req.body.promoCode })
  console.log("discount", discount);
  let Dis = 0;
  for (let i = 0; i <= discount.length - 1; i++) {
    Dis += discount[i].discount
  }
  console.log("Percentage", Dis);
  if (discount) {
    let minus = value * Dis / 100
    totalAmount -= minus
  }
  //DISCOUNT AMOUNT
  let discountAmount = minus;
  // ORDER ID
  let orderid;
  let count = await CheckOutModel.find({}).sort({ _id: -1 }).limit('1')
  for (let i = 0; i <= count.length - 1; i++) {
    orderid = count[i].Orderid
  }
  console.log("count", orderid);
  orderid += 1



  // PAYMENT STATUS
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
        Orderid: orderid,
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
/*                 Change Status                */
/************************************************/
router.post('/update-status', async (req, res) => {
  const update = await CheckOutModel.findOneAndUpdate({ _id: req.body._id }, { Status: req.body.Status })
    .then(data => {
      console.log("data", data);
      res.json({ sucess: "Status Update Succesfully" })
    }).catch(err => {
      console.log(err);
      res.json({ err: "status not update" })
    })
})

/************************************************/
/*                 Promo Code                   */
/************************************************/
router.post('/add-promo-code', async (req, res) => {
  console.log("promo", req.body);

  await new promoModel({
    promoCode: req.body.promoCode,
    discount: req.body.discount
  }).save()
    .then(data => {
      console.log(data);
      res.json({ message: "promo code add succesfully" })
    }).catch(err => {
      console.log(err);
      res.json({ err: "promo code not add due to some error" })
    })
})
/************************************************/
/*              Update Promo Code               */
/************************************************/
router.post('/update-promo-code/:id?', async (req, res) => {
  try {
    await promoModel.findOneAndUpdate({ _id: req.params.id }, {
      promoCode: req.body.promoCode, discount: req.body.discount
    }).then(data => {
      console.log(data);
      res.json({ message: "update successfully" })
    })


  } catch (error) {
    console.log(error);
    res.json({ err: "error" })
  }
})
/************************************************/
/*              Delete Promo Code               */
/************************************************/
router.post('/delete-promo-code/:id?', async (req, res) => {
  try {
    await promoModel.findOneAndDelete({ _id: req.params.id })
      .then(data => {
        res.json({ message: "promo delete successfully" })
      })
  } catch (error) {
    console.log(error);
    res.json({ err: "promo code not delete due to some error" })
  }
})
/************************************************/
/*                 Place Order                  */
/************************************************/
router.get('/place-order/:orderid?', async (req, res) => {

  const id = req.params.orderid

  await CheckOutModel.find({ Orderid: id })
    .populate("Productids")
    .then(find => {
      console.log(find);
      res.json(find)

    })



})



/************************************************/
/*                   Review                     */
/************************************************/
router.post('/add-review', async (req, res) => {
  console.log("review", req.body);

  try {
    await new reviewmodel({
      productID: ObjectId(req.body.productID),
      userID: req.body.userID,
      stars: req.body.stars,
      text: req.body.text,
      timestamp: Date.now(),
    }).save()
      .then(async data => {
        let value = 0;
        const reviews = await reviewmodel.find({ productID: req.body.productID });
        for (let i = 0; i <= reviews.length - 1; i++) {
          value += reviews[i].stars
        }
        const ratingScore = value / reviews.length
        console.log(ratingScore);
        const find = await ProductModel.findOneAndUpdate({ _id: req.body.productID }, {
          ratingScore: ratingScore, count: reviews.length
        })
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
router.get('/reviews-by-user/:userID?', async (req, res) => {
  console.log("params", req.params.userID);
  const find = await reviewmodel.find({ userID: req.params.userID })

    .then(data => {
      console.log(data);
      res.json({ findByUserID: data })
    })
    .catch(err => {
      console.log(err);
      res.json({ error: "data not get due to error" })
    })
})


/************************************************/
/*            Get Review By productID           */
/************************************************/
router.get('/reviews-by-product/:productid?', async (req, res) => {
  console.log("params", req.params.productid);
  const find = await reviewmodel.find({ productID: (req.params.productid) })

    .then(data => {
      console.log(data);
      res.json({ findByProductis: data })
    })
    .catch(err => {
      console.log(err);
      res.json({ error: "data not get due to error" })
    })
})


/************************************************/
/*               Remove Review                  */
/************************************************/
router.post('/remove-review', async (req, res) => {
  try {
    const find = await reviewmodel.findByIdAndRemove({ _id: req.body._id })
    res.json({ message: "Review Remove successfully" })
  } catch (error) {
    console.log(error);
    res.json({ error: "error occured" })
  }
})

/************************************************/
/*                 Search Bar                   */
/************************************************/
router.get('/search', async (req, res) => {
  let regex = new RegExp(req.query["term"], 'i');
  await ProductModel.find({ ProductName: regex }, { "ProductName": 1 })
    .then(data => {
      console.log(data);
      myLabels = data.map(e => e.ProductName)
      console.log("----------",myLabels);
      return res.jsonp({ label: myLabels })
    })
    .catch(err => {
      console.log(err);
    })
})

router.get('/search2/:pname?', async (req, res) => {
  await ProductModel.find({ ProductName: req.params.pname })
    .then(data => {
      console.log(data);
      return res.json({ data })
    })
    .catch(err => {
      console.log(err);
    })
})




module.exports = router;