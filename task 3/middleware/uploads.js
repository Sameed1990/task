const multer = require("multer")

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/imageUpload')
    },
    filename:function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const storageVideo = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/videoUpload')
    },
    filename:function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
});

// file validation

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype ===  'image/png'){
        cb(null,true);
    }else{
        cb({message: 'Unsupported File Format'}, false)
    }
};

const fileFilterVideo = (req, file, cb) => {
    if(file.mimetype === 'video/mp4'){
        cb(null,true);
    }else{
        cb({message: 'Unsupported File Format'}, false)
    }
};


const uploadImage = multer({
    storage: storage,
    limits: {fileSize: 4096 * 4096},
    fileFilter: fileFilter
});

const uploadVideo = multer({
    storage: storage,
    fileFilter: fileFilterVideo
});

module.exports = {uploadImage, uploadVideo};