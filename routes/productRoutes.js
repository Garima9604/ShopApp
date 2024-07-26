const express = require("express");
const router = express.Router();
const {
  validateProduct,
  isLoggedIn,
  isSeller,
  isProductAuthor,
} = require("../middleware");

const {
  showAllProducts,
  productForm,
  createProduct,
  showProduct,
  editProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

// show all the products
router.get("/products", showAllProducts);

// to open the form of adding new product
router.get("/products/new", isLoggedIn, isSeller, productForm);

// actually adding a product in a DB
router.post("/products", isLoggedIn, isSeller, validateProduct, createProduct);

// to show a particular product
router.get("/products/:id", isLoggedIn, showProduct);

//to edit the particular product
router.get("/products/:id/edit", isLoggedIn, isSeller, editProduct);

// updating the changes in db
router.patch(
  "/products/:id",
  isLoggedIn,
  isSeller,
  isProductAuthor,
  validateProduct,
  updateProduct
);

//delete a route
router.delete(
  "/products/:id",
  isLoggedIn,
  isSeller,
  isProductAuthor,
  deleteProduct
);

module.exports = router;
