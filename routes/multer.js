// require multer and v4 of uuid
const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const path = require('path');

// setting up the diskstorage engine-> which provides you full control on storing files to disk
const postsStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images/uploads'); // destination folder for uploads
    },
    filename: (req, file, cb)=>{
        const uniqueFileName = uuidv4(); // genreating unique file name using uuid
        cb(null, uniqueFileName + path.extname(file.originalname)); // use the unique file name for the uploaded file
    }
});

const dpStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/dp');
    },
    filename: function(req, file, cb) {
        const uniqueFileName = uuidv4();
        cb(null, uniqueFileName + path.extname(file.originalname));
    }
});

const upload = {
    dpUpload: multer({ storage: dpStorage })
};

module.exports = upload;


const postUpload = multer({storage: postsStorage});
const dpUpload = multer({storage: dpStorage});

module.exports ={
    postUpload,
    dpUpload
};