const { Router } = require("express");
const { check } = require("express-validator");
const { validateJwT, validateFields, isAdminRole } = require("../middlewares");
const {
  getPosts,
  postPosts,
  putPost,
  deletePost,
  likePost,
} = require("../controller");
const { existPostById, existCategorieId, existUserId } = require("../helpers");

const router = Router();

// Post - GET
router.get("/", getPosts);

// Post - POST
router.post(
  "/",
  [
    validateJwT,
    check("title", "Title is required").not().isEmpty().escape(),
    check("description", "Description is required").not().isEmpty().escape(),
    check("ingredients.*", "Ingredient is required").not().isEmpty().escape(),
    check("instructions.*", "Instruction is required").not().isEmpty().escape(),
    check("categorie", "Not a valid id").isMongoId(),
    check("categorie").custom(existCategorieId),
    validateFields,
  ],
  postPosts
);

// Post - Update
router.put(
  "/:postId/update/:userId",
  [
    validateJwT,
    isAdminRole,
    check("title", "Title is required").escape(),
    check("description", "Description is required").escape(),
    check("ingredients.*", "Ingredient is required").escape(),
    check("instructions.*", "Instruction is required").escape(),
    check("postId", "Not a valid id").isMongoId(),
    check("postId").custom(existPostById),
    check("userId", "Not a valid id").isMongoId(),
    check("userId").custom(existUserId),
    validateFields,
  ],
  putPost
);

// Post - Delete
router.delete(
  "/:postId/update/:userId",
  [
    validateJwT,
    isAdminRole,
    check("postId", "Not a valid id").isMongoId(),
    check("postId").custom(existPostById),
    check("userId", "Not a valid id").isMongoId(),
    check("userId").custom(existUserId),
    validateFields,
  ],
  deletePost
);

module.exports = router;
