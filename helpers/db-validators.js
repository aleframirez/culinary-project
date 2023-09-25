const { User, Categorie, Post, Comment } = require("../models");
const Role = require("../models/role");

// Check if the email exist
const validEmail = async (email = "") => {
  const existantEmail = await User.findOne({ email });

  if (existantEmail) {
    throw new Error(`Email: ${email}, is already in use.`);
  }
};

// Check if the Role exist
const validRole = async (role = "") => {
  const existantRole = await Role.findOne({ role });

  if (!existantRole) {
    throw new Error(`Role: ${role}, is not registered in de database`);
  }
};

// Check if the User exist
const existUserId = async (id) => {
  const existUserId = await User.findById(id);
  if (!existUserId) {
    throw new Error("The User Id does not exist");
  }
};

// Check if the Categorie exist
const existCategorieId = async (id) => {
  const existCategorieId = await Categorie.findById(id);
  if (!existCategorieId) {
    throw new Error("The Categorie Id does not exist");
  }
};

// Check if the Product exist
const existPostById = async (id) => {
  const existPostById = await Post.findById(id);
  if (!existPostById) {
    throw new Error("The Post Id does not exist");
  }
};

// Check if the Comment exist
const existCommentId = async (id) => {
  const existCommentId = await Comment.findById(id);
  if (!existCommentId) {
    throw new Error("The Comment Id does not exist");
  }
};

const allowedCollections = (collection = "", collections = []) => {
  const included = collections.includes(collection);
  if (!included) {
    throw new Error(`Collection: ${collection} is not allowed, ${collections}`);
  }
  return true;
};

module.exports = {
  validEmail,
  validRole,
  existUserId,
  existCategorieId,
  existPostById,
  allowedCollections,
  existCommentId,
};
