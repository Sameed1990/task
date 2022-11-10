var express = require('express');
var router = express.Router();






// middleware 
const {CheckEnum} = require("../middleware/checkEnum")
const {CheckWeight} = require("../middleware/checkWeight")

// Schemas //
const EnumModel = require("../models/Enum")
const ProductModel = require("../models/ProductDeminision")
const WeightModel = require("../models/weight")
const ProductWeightModel = require("../models/ProductWeight")
const tagModel = require("../models/Tag")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/Enums-table' , async (req , res) =>{
  const find = await EnumModel.find({})
  console.log(find);
  res.render('EnumTable' , {enum : find})
})





/////////************************************ *//////////
////////               TAGS                    ////////// 
/////////************************************ *//////////
router.post('/add-tags' , async (req , res) =>{
  console.log("Tags" , req.body);
  try{
    await new tagModel({
      name : req.body.name,
      description : req.body.description,
      img : req.body.img
    }).save()
    .then(data=>{
      console.log(data);
      res.json({message : "Tag data send succesfully"})
    })
  }
  catch(error){
    console.log(error);
    res.json({error : "Internel server error"})
  }
})
router.post('/update-tag' , async (req , res) =>{
  console.log("update tag" , req.body);

  try{
    const find = await tagModel.find({_id : req.body.id})
    if(find){
    await tagModel.findOneAndUpdate({
        name : req.body.name,
        description : req.body.description,
        unit : req.body.unit
      })
     res.json({message : "Tag Update Succesfull"})
    }
  }
  catch(error){
    console.log(error);
    res.json({error : "Error occured"})
  }
})
router.post('/tag-delete' , async (req , res) =>{
  console.log("Delete Tag" , req.body );
  try{
    const find = tagModel.find({_id : req.body._id});
    if(find){
      await tagModel.findOneAndDelete({})
      res.json({message : "Tag Delete Sucessful"})
    }
  }
  catch(error){
    console.log(error);
    res.json({error : "internal error"})
  }
})










/////////************************************ *//////////
////////               POST METHODS         ////////// 
/////////************************************ *//////////



/////////************************************ *//////////
////////               ENUM                    ////////// 
/////////************************************ *//////////


router.post('/add-Enum' , CheckEnum , async (req , res) =>{
console.log("Enum" + req.body.Enum);
const find = EnumModel.find({});
try{
  await new EnumModel({
    Enum : req.body.Enum
  }).save()
  .then(data=>{
  console.log(data);
  res.json({messge : "Product Enum Data Send Succesful"})
})

}
catch(error){
  console.log(error);
 return res.json({error : "data not found"})
}




})
router.post('/Enum-Update' , async (req , res) =>{
console.log("Update" , req.body);

const find = await EnumModel.find({_id : req.body._id}) 
console.log(find);
try{
if(find){
  await EnumModel.findOneAndUpdate({Enum : req.body.Enum})
  res.json({message : "Update sucessfully"})
}else{
  res.json({message : "Update not sucessfully"})
}
}
catch(error){
  console.log(error);
}
})

router.post('/Enum-Delete' , async (req , res) =>{
  console.log("Delete" , req.body);
  
  const find = await EnumModel.find({_id : req.body._id}) 
  console.log(find);
  try{
  if(find){
    await EnumModel.findOneAndDelete({})
    res.json({message : "Delete sucessfully"})
  }else{
    res.json({message : "Delete not sucessfully"})
  }
  }
  catch(error){
    console.log(error);
  }
  })



/////////************************************ *//////////
////////               PRODUCT                    ////////// 
/////////************************************ *//////////

router.post('/add-product' , async (req , res) =>{
  console.log("product" + req.body.unit);
  const find = await EnumModel.find({_id : req.body.unit})
  console.log("find" , find);
  try {
    if(find){
   await new ProductModel({
      productid : req.body.productid,
      width : req.body.width,
      height :req.body.height,
      unit :req.body.unit
    }).save()
    .then(data=>{
      console.log(data);
      res.json({message : "product add succesfully"})
    })
  } else{
    res.json({Error : "Enum is not Exist"})
  }

    
  } catch (error) {
    console.log(error);
    res.json({error : "internel server error"})
  }
})

router.post('/Product-Update' , async (req , res) =>{
  console.log("Update" , req.body);
  
  const find = await ProductModel.find({_id : req.body._id}) 
  console.log(find);
  try{
  if(find){
    await ProductModel.findOneAndUpdate({
      productid : req.body.productid,
      width : req.body.width,
      height : req.body.height,
      unit : req.body.unit
    })
    res.json({message : "Update sucessfully"})
  }else{
    res.json({message : "Update not sucessfully"})
  }
  }
  catch(error){
    console.log(error);
  }
  })

  router.post('/Product-Delete' , async (req , res) =>{
    console.log("Delete" , req.body);
    
    const find = await ProductModel.find({_id : req.body._id}) 
    console.log(find);
    try{
    if(find){
      await ProductModel.findOneAndDelete({})
      res.json({message : "Delete Product sucessfully"})
    }else{
      res.json({message : "Delete not sucessfully"})
    }
    }
    catch(error){
      console.log(error);
    }
    })


    
/////////************************************ *//////////
////////               WEIGHT                    ////////// 
/////////************************************ *//////////

router.post('/add-Weight' , CheckWeight , async (req , res) =>{
  console.log("Weight" + req.body.weight);
  const find = WeightModel.find({});
  try{
    await new WeightModel({
      weight : req.body.weight
    }).save()
    .then(data=>{
    console.log(data);
    res.json({messge : "weight Data Send Succesful"})
  })
  
  }
  catch(error){
    console.log(error);
   return res.json({error : "data not found"})
  }
  
  
  
  
})

router.post('/Weight-Update' , async (req , res) =>{
    console.log("Weight" , req.body);
    
    const find = await WeightModel.find({_id : req.body._id}) 
    console.log(find);
    try{
    if(find){
      await WeightModel.findOneAndUpdate({weight : req.body.weight})
      res.json({message : "Update sucessfully"})
    }else{
      res.json({message : "Update not sucessfully"})
    }
    }
    catch(error){
      console.log(error);
    }
})
router.post('/Weight-Delete' , async (req , res) =>{
      console.log("Delete" , req.body);
      
      const find = await WeightModel.find({_id : req.body._id}) 
      console.log(find);
      try{
      if(find){
        await WeightModel.findOneAndDelete({})
        res.json({message : "Delete sucessfully"})
      }else{
        res.json({message : "Delete not sucessfully"})
      }
      }
      catch(error){
        console.log(error);
      }
})


/////////************************************ *//////////
////////               PRODUCT WEIGHT          ////////// 
/////////************************************ *//////////

router.post('/add-product-weight' , async (req , res) =>{
  console.log("product weight" + req.body.unit);
  const find = await WeightModel.find({_id : req.body.weight})
  const find2 = await EnumModel.find({_id : req.body.unit})
  console.log("find" , find);
  try {
    if(find){
   await new ProductWeightModel({
      productid : req.body.productid,
      weight : req.body.weight,
      unit :req.body.unit
    }).save()
    .then(data=>{
      console.log(data);
      res.json({message : "product add succesfully"})
    })
  } else{
    res.json({Error : "Enum is not Exist"})
  }

    
  } catch (error) {
    console.log(error);
    res.json({error : "internel server error"})
  }
})

router.post('/Product-Weight-Update' , async (req , res) =>{
  console.log("Weight" , req.body);
  
  const find = await ProductWeightModel.find({_id : req.body._id}) 
  console.log(find);
  try{
  if(find){
    await ProductWeightModel.findOneAndUpdate({
      productid : req.body.productid,
      weight : req.body.weight,
      unit : req.body.unit
    })
    res.json({message : "Update sucessfully"})
  }else{
    res.json({message : "Update not sucessfully"})
  }
  }
  catch(error){
    console.log(error);
  }
  })

  router.post('/Product-Weight-Delete' , async (req , res) =>{
    console.log("Weight" , req.body);
    
    const find = await ProductWeightModel.find({_id : req.body._id}) 
    console.log(find);
    try{
    if(find){
      await ProductWeightModel.findOneAndDelete({})
      res.json({message : "Delete Product sucessfully"})
    }else{
      res.json({message : "Delete not sucessfully"})
    }
    }
    catch(error){
      console.log(error);
    }
    })
module.exports = router;
