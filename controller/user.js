const { response, request } = require("express");
// const User = require("../models/user");
const bcrypt = require("bcrypt");
const { User, Post, Comment } = require("../models");

// Get Users
const getUsers = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;

  const [total, users] = await Promise.all([
    User.countDocuments({ status: true }),
    User.find({ status: true }).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    msg: "Get /api/users - Controller",
    total,
    users,
  });
};

// Post User
const postUsers = async (req = request, res = response) => {
  // We get de data we want to use
  const { name, username, email, password, role } = req.body;
  const user = new User({ name, username, email, password, role });

  // Encrypt the password with bcrypt
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  user.username = `@${username}`;

  // Save in the DB
  await user.save();

  res.status(200).json({
    msg: "Post /api/users - Controller",
    user,
  });
};

// Update User
const putUsers = async (req = request, res = response) => {
  const { id } = req.params;
  const {
    _id,
    password,
    username,
    google,
    email,
    followers,
    following,
    ...remainder
  } = req.body;
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).*$/;

  if (password) {
    if (!regex.test(password)) {
      return res.status(400).json({ error: "Invalid Password" });
    }
    const salt = bcrypt.genSaltSync();
    remainder.password = bcrypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, remainder);

  res.status(200).json({
    msg: "Put /api/users - Controller",
    user,
  });
};

// Delete User
const deleteUsers = async (req = request, res = response) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.status(200).json({
    msg: "Delete /api/users - Controller",
    user,
  });
};

// Follow a User
const followUser = async (req = request, res = response) => {
  const { id, followId } = req.params;

  const user = await User.findById(id);
  const userToFollow = await User.findById(followId);

  // Check if user is already following the other
  const isFollowing = user.following.includes(followId);

  if (isFollowing) {
    // If it following, commit the unfollow
    user.following = user.following.filter(
      (userId) => userId.toString() !== followId
    );
    userToFollow.followers = userToFollow.followers.filter(
      (userId) => userId.toString() !== id
    );
  } else {
    // If it not, follow
    user.following.push(followId);
    userToFollow.followers.push(id);
  }

  await Promise.all([user.save(), userToFollow.save()]);

  res.status(200).json({
    msg: isFollowing ? "Now unfollowing" : "Now following",
    user: {
      _id: user._id,
      username: user.username,
      following: user.following,
    },
  });
};

// Like a Post
const likePost = async (req = request, res = response) => {
  const { id, postId } = req.params;

  const user = await User.findById(id);
  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  // Check if user has already liked the post
  const hasLiked = post.likes.includes(id);

  if (hasLiked) {
    // If user has liked, commit the unlike
    post.likes = post.likes.filter((userId) => userId.toString() !== id);
  } else {
    // If user has not liked, add the like
    post.likes.push(id);
  }

  // Update the total likes count on the post
  post.totalLikes = post.likes.length;

  await post.save();

  res.status(200).json({
    msg: hasLiked ? "Post unliked successfully." : "Post liked successfully.",
    post: {
      _id: post._id,
      title: post.title,
      totalLikes: post.totalLikes,
    },
  });
};

// Like Comment
const likeComment = async (req = request, res = response) => {
  const { id, commentId } = req.params;

  const user = await User.findById(id);
  const comment = await Comment.findById(commentId);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found." });
  }

  // Check if user has already liked the comment
  const hasLiked = comment.likes.includes(id);

  if (hasLiked) {
    // If user has liked, commit the unlike
    comment.likes = comment.likes.filter((userId) => userId.toString() !== id);
  } else {
    // If user has not liked, add the like
    comment.likes.push(id);
  }

  // Update the total likes count on the comment
  comment.totalLikes = comment.likes.length;

  await comment.save();

  res.status(200).json({
    msg: hasLiked
      ? "Comment unliked successfully."
      : "Comment liked successfully.",
    comment: {
      _id: comment._id,
      totalLikes: comment.totalLikes,
    },
  });
};

// Save a Post

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers,
  followUser,
  likePost,
  likeComment,
};
