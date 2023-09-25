const { request, response } = require("express");
const { Comment, Post, User } = require("../models");

// Get Comment
const getComment = async (req = request, res = response) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  let totalComments = 0;
  const comments = [];

  for (let i = 0; i < post.comments.length; i++) {
    const comment = await Comment.findById(post.comments[i]);
    if (comment.status) {
      totalComments++;
      comments.push(comment);
    }
  }

  res.status(200).json({
    msg: "GET /api/comments - Controller",
    totalComments,
    comments,
  });
};

// Post Comment
const postComment = async (req = request, res = response) => {
  const { postId, authorId } = req.params;
  const { status, author, ...body } = req.body;

  const post = await Post.findById(postId);
  const user = await User.findById(authorId);

  const data = {
    ...body,
    author: user._id,
  };

  const comment = new Comment(data);
  post.comments.push(comment);

  await post.save();
  await comment.save();

  res.status(200).json({
    msg: "Post /api/comments - Controller",
    comment,
  });
};

// Update Comment
const putComment = async (req = request, res = response) => {
  const { commentId, userId } = req.params;
  const { status, user, ...data } = req.body;

  const newComment = await Comment.findByIdAndUpdate(commentId, data, {
    new: true,
  });

  return res
    .status(201)
    .json({ msg: "PUT /api/comments - Controllers", newComment });
};

// Delete Comment
const deleteComment = async (req = request, res = response) => {
  const { commentId, userId, postId } = req.params;

  const post = await Post.findById(postId);
  const comment = await Comment.findById(commentId);

  post.comments = post.comments.filter(
    (commId) => commId.toString() !== commentId
  );
  const deleteComment = await Comment.deleteOne({ _id: commentId });

  await post.save();

  return res.status(200).json({
    msg: "Delete /api/comment - Controller",
  });
};

module.exports = {
  getComment,
  putComment,
  postComment,
  deleteComment,
};
