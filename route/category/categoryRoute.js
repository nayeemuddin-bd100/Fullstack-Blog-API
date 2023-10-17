const express = require('express');
const {
	createCategoryCtrl,
	fetchAllCategoryCtrl,
	fetchSingleCategoryCtrl,
	updateCategoryCtrl,
	deleteCategoryCtrl,
} = require("../../controllers/category/categoryCtrl");

const authMiddleware = require('../../middlewares/auth/authMiddleware');

const categoryRoute = express.Router()

// create category
categoryRoute.post("/", authMiddleware, createCategoryCtrl);

//fetch all category
categoryRoute.get("/", fetchAllCategoryCtrl);

//fetch single category
categoryRoute.get("/:categoryId", authMiddleware, fetchSingleCategoryCtrl);

//update category
categoryRoute.put("/:categoryId", authMiddleware, updateCategoryCtrl);

//delete category
categoryRoute.delete("/:categoryId", authMiddleware, deleteCategoryCtrl);


module.exports = categoryRoute;