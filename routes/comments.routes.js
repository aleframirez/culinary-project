const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields, validateJwT, isAdminRole } = require("../middlewares");
const {
  getComment,
  postComment,
  putComment,
  deleteComment,
} = require("../controller");
const { existCommentId, existUserId, existPostById } = require("../helpers");

const router = Router();

router.get("/:postId", getComment);

router.post(
  "/:postId/post/:authorId",
  [
    validateJwT,
    check("text", "Your comment cannot be empty").not().isEmpty().escape(),
    validateFields,
  ],
  postComment
);

router.put(
  "/:commentId/update/:userId",
  [
    validateJwT,
    isAdminRole,
    check("text", "Your comment cannot be empty").escape(),
    check("commentId", "Not a valid id").isMongoId(),
    check("commentId").custom(existCommentId),
    check("userId", "Not a valid id").isMongoId(),
    check("userId").custom(existUserId),
    validateFields,
  ],
  putComment
);

router.delete(
  "/:commentId/delete/:userId/from/:postId",
  [
    validateJwT,
    isAdminRole,
    check("commentId", "Not a valid id").isMongoId(),
    check("commentId").custom(existCommentId),
    check("userId", "Not a valid id").isMongoId(),
    check("userId").custom(existUserId),
    check("postId", "Not a valid id").isMongoId(),
    check("postId").custom(existPostById),
    validateFields,
  ],
  deleteComment
);

module.exports = router;
