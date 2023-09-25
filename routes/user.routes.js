const { Router } = require("express");
const { check } = require("express-validator");

const {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers,
  followUser,
  likePost,
  likeComment,
} = require("../controller");

const {
  validEmail,
  existUserId,
  validRole,
  existPostById,
  existCommentId,
} = require("../helpers");

const {
  validateFields,
  validateJwT,
  isAdminRole,
  haveRole,
} = require("../middlewares");

const router = Router();

// User - GET
router.get("/", getUsers);

// User - POST
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty().escape(),
    check("username", "username is required").not().isEmpty().escape(),
    check(
      "password",
      "The password must contain at least 8 characters and 1 special character"
    )
      .isLength({ min: 8 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).*$/)
      .escape(),
    check("email", "Invalid email").isEmail().normalizeEmail(),
    check("email").custom(validEmail),
    check("role").custom(validRole),
    validateFields,
  ],
  postUsers
);

// User - Update
router.put(
  "/:id",
  [
    check("id", "Not a valid id").isMongoId(),
    check("id", existUserId),
    check("role", validRole),
    validateFields,
  ],
  putUsers
);

// User - Delete
router.delete(
  "/:id",
  [
    validateJwT,
    isAdminRole, // It forces you to be an administrator.
    haveRole("ADMIN_ROLE"), // It can be any of the roles that we give here.
    check("id", "Not a valid id").isMongoId(),
    check("id").custom(existUserId),
    validateFields,
  ],
  deleteUsers
);

// User - Follow
router.post(
  "/:id/follow/:followId",
  [
    check("id", "Not a valid id").isMongoId(),
    check("id").custom(existUserId),
    check("followId", "Not a valid id").isMongoId(),
    check("followId").custom(existUserId),
    validateFields,
  ],
  followUser
);

// User - Like Post
router.post(
  "/:id/like/:postId",
  [
    check("id", "Not a valid id").isMongoId(),
    check("id").custom(existUserId),
    check("postId", "Not a valid id").isMongoId(),
    check("postId").custom(existPostById),
    validateFields,
  ],
  likePost
);

// User - Like Comment
router.post(
  "/:id/like/:commentId",
  [
    check("id", "Not a valid id").isMongoId(),
    check("id").custom(existUserId),
    check("commentId", "Not a valid id").isMongoId(),
    check("commentId").custom(existCommentId),
    validateFields,
  ],
  likeComment
);

module.exports = router;
