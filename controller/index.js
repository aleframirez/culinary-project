// Auth
const { login, googleSignIn } = require("./auth");

// Users
const {
  getUsers,
  putUsers,
  likePost,
  postUsers,
  followUser,
  deleteUsers,
  likeComment,
} = require("../controller/user.js");

// Categories
const {
  putCategorie,
  getCategories,
  postCategorie,
  deleteCategorie,
  getCategoriesById,
} = require("./categories.js");

// Search
// const {
//   searchUser,
//   searchCategories,
//   searchProducts,
//   search,
// } = require("../controller/search.js");

// Upload Files
const {
  loadFile,
  showImage,
  updateImage,
  updateCloudinaryImage,
} = require("../controller/uploads.js");

// Posts
const {
  putPost,
  getPosts,
  postPosts,
  deletePost,
  getPostById,
} = require("./post");

// Comments
const {
  putComment,
  getComment,
  postComment,
  deleteComment,
} = require("./comments");

module.exports = {
  login,
  putPost,
  getPosts,
  getUsers,
  putUsers,
  loadFile,
  likePost,
  postUsers,
  showImage,
  postPosts,
  putComment,
  deletePost,
  followUser,
  getComment,
  updateImage,
  postComment,
  deleteUsers,
  likeComment,
  getPostById,
  putCategorie,
  googleSignIn,
  postCategorie,
  deleteComment,
  getCategories,
  deleteCategorie,
  getCategoriesById,
  updateCloudinaryImage,
};
