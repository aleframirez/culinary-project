const { Comment, Post } = require("../models");

const isAdminRole = async (req, res, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "You must validate the token before you can validate the role",
    });
  }

  const { role, name } = req.user;
  const { commentId, userId, postId } = req.params;

  const comment = await Comment.findById(commentId);
  const post = await Post.findById(postId);

  if (
    role !== "ADMIN_ROLE" ||
    (postId && commentId && userId !== comment.author.toString()) ||
    (commentId && userId !== comment.author.toString()) ||
    (postId && userId !== post.author.toString())
  ) {
    return res.status(401).json({
      msg: "it looks like you don't own this or you are not an ADMIN.",
    });
  }

  next();
};

const haveRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: "You must validate the token before you can validate the role",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `The service requires one of this roles: ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  haveRole,
};
