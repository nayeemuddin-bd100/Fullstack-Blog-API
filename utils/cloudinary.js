const cloudinary = require("cloudinary").v2;


// Configuration 
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


const cloudinaryUpload = async (fileToUpload) => {



    try {
        const data = await cloudinary.uploader.upload(fileToUpload, {
					folder: "wordcrafters",
					resource_type: "auto",
				});
        return data?.secure_url;
    } catch (error) {
        return error
    }
}

module.exports = cloudinaryUpload

