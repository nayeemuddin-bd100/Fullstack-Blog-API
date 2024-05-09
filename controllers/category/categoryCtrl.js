const expressAsyncHandler = require("express-async-handler");
const Category = require("../../model/category/Category");
const validateMongoDbId = require("../../utils/validateMongoDbId");
const Post = require("../../model/post/Post");


/*=============================================
=              Create Category API          =
=============================================*/
const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
	const { _id } = req.headers.user;
	const { title } = req?.body;

	try {
		const category = await Category.create({
			user:_id,
			title
		})
		res.json(category);
	} catch (error) {
		res.json(error);
	}
});


/*=============================================
=              Fetch all category         =
=============================================*/

const fetchAllCategoryCtrl = expressAsyncHandler(async (req, res) => {

	try {
		const category = await Category.find({}).populate("user");
		res.json(category);
	} catch (error) {
		res.json(error)
	}
})


// const fetchAllCategoryCtrl = expressAsyncHandler(async (req, res) => {
//   try {
//     const categories = await Category.aggregate([
//       {
//         $lookup: {
//           from: "Post", // Replace 'posts' with the name of your Post model's collection
//           localField: '_id',
//           foreignField: 'category',
//           as: 'posts'
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           title: 1,
//           totalPost: { $size: '$posts' }
//         }
//       }
//     ]);

//     res.json(categories);
//   } catch (error) {
//     res.json(error);
//   }
// });

/*=============================================
=              Fetch single category         =
=============================================*/
const fetchSingleCategoryCtrl = expressAsyncHandler(async(req, res) => {
	const { categoryId } = req?.params
	
	try {
		const category = await Category.findById(categoryId)
		res.json(category)
	} catch (error) {
		res.json(error)
	}
})


/*=============================================
=             update category         =
=============================================*/
const updateCategoryCtrl = expressAsyncHandler(async (req, res) => {
	const { categoryId } = req?.params;
	const { title } = req?.body;

	try {

		const category = await Category.findByIdAndUpdate(categoryId, {
			title
		},{new:true,runValidators:true});

		res.json(category);
	} catch (error) {
		res.json(error);
	}
	
});
/*=============================================
=              Delete category         =
=============================================*/
const deleteCategoryCtrl = expressAsyncHandler(async (req, res) => {
	const { categoryId } = req?.params;

	try {
		const category = await Category.findByIdAndDelete(categoryId)
		res.json(category);
	} catch (error) {
		res.json(error)
	}


});


module.exports = {
	createCategoryCtrl,
	fetchAllCategoryCtrl,
	fetchSingleCategoryCtrl,
	fetchSingleCategoryCtrl,
	updateCategoryCtrl,
	deleteCategoryCtrl,
};
