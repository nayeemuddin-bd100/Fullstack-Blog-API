const multer = require("multer")
const sharp = require("sharp")
const path = require("path")
const fsPromises = require("fs").promises;

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


const photoUpload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
	// limits: { fileSize: 1000000 }, //file limits to 1 mb
}).single("image");



// Resize profile photo
const profilePhotoResize = async (req, res, next) => {
    // check there is no file
    if (!req.file) return next();
    
    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
    const filePath = path.join(`public/images/profile/${req.file.filename}`);

    
    await sharp(req.file.buffer)
			.resize(250, 250)
			.toFormat("jpeg")
			.jpeg({ quality: 90 })
			.toFile(filePath);   
    next()

}

// Resize posts photo
const postsImgResize = async (req, res, next) => {
    // check there is no file
    if (!req.file) return next();
    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
		const filePath = path.join(`public/images/posts/${req.file.filename}`);

		try {
			await fsPromises.mkdir(path.dirname(filePath), { recursive: true });
		} catch (error) {
			return next(error);
		}

   
    await sharp(req.file.buffer)
			.resize(500, 500)
			.toFormat("jpeg")
			.jpeg({ quality: 90 })
			.toFile(filePath); 
    next()
   

}


module.exports = { photoUpload, profilePhotoResize, postsImgResize };