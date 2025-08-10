import express from "express";
const router = express.Router();
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
  
} from "../controllers/productController.js";




// router.get('/', getProducts);
// router.get('/:id', getProductById);
router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);
router.route('/:id/reviews').post(createProductReview)


export default router;