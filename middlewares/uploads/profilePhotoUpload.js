const multer = require("multer")
const sharp = require("sharp")
const path = require("path")


// Here we are using memorystorage instead of diskstorage since we stored in memory as buffer , it would be helpful for our performance.
const multerStorage = multer.memoryStorage()

// file type checking
const multerFilter = (req, file, cb) => {
    
    if (file.mimetype.startsWith("image")) {       
        cb(null, true)
    } else {
        cb({message: "Unsupported format"},false)
    }
}


const profilePhotoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 }, //file limits to 1 mb
}).single("image");



const profilePhotoResize = async (req, res, next) => {
    // check there is no file
    if (!req.file) return next();
    
    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

    
    await sharp(req.file.buffer)
      .resize(250, 250)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(`public/images/profile/${req.file.filename}`))
   
    
    next()

}


module.exports = { profilePhotoUpload, profilePhotoResize };