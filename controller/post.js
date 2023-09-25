const { request, response } = require("express");
const { Post, User } = require("../models");

// Get Posts
const getPosts = async (req = request, res = response) => {
  const { limit = 10, from = 0 } = req.query;

  const [total, posts] = await Promise.all([
    Post.countDocuments({ status: true }),
    Post.find({ status: true }).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    msg: "GET /api/post - Controller",
    total,
    posts,
  });
};

// Get Post By ID
const getPostById = async (req = request, res = response) => {
  const { id } = req.params;
  const post = await Post.findById(id)
    .populate("user", "username")
    .populate("categorie", "name");

  // If the status is false, send an error.
  if (!post.status) {
    res.status(400).json({
      msg: "This post has been deleted.",
    });
  }

  res.status(200).json({
    msg: "GET/:id /api/post - Controller",
    post,
  });
};

// Create Post
const postPosts = async (req = request, res = response) => {
  const { status, author, ...body } = req.body;

  // Look for a post with the name that we pass to it and we assign it to postDB
  const postDB = await Post.findOne({ title: body.title });

  // If the post already exist, send an error
  if (postDB) {
    return res.status(400).json({
      msg: `Post: ${postDB.title}, already exist`,
    });
  }

  // Generate the data to save
  const data = {
    ...body,
    title: body.title.toUpperCase(),
    author: req.user._id,
  };

  // Create a Post using the model
  const post = new Post(data);

  // Save in the DB
  await post.save();

  res.status(201).json({
    msg: "POST /api/post - Controller",
    post,
  });
};

// Update Post
const putPost = async (req = request, res = response) => {
  const { postId } = req.params;
  const { status, user, ...data } = req.body;

  data.title = data.title.toUpperCase();
  // data.user = data.user._id; // User that update the Post.

  const post = await Post.findByIdAndUpdate(postId, data, { new: true });

  res.status(201).json({
    msg: "PUT /api/post - Controller",
    post,
  });
};

// Delete Post
const deletePost = async (req = request, res = response) => {
  const { postId } = req.params;

  const postDeleted = await Post.findByIdAndUpdate(
    postId,
    { status: false },
    { new: true }
  );

  res.status(200).json({
    msg: "DELETE /api/post - Controller",
    postDeleted,
  });
};

module.exports = {
  getPosts,
  getPostById,
  postPosts,
  putPost,
  deletePost,
};
