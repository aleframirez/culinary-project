const { Schema, model } = require("mongoose");

const PostSchema = Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    ingredients: [
      {
        type: String,
        require: true,
      },
    ],
    instructions: [
      {
        type: String,
        require: true,
      },
    ],
    img: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true,
      },
    ],
    totalLikes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        require: true,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    categorie: {
      type: Schema.Types.ObjectId,
      ref: "Categorie",
      require: true,
    },
  },
  { timestamps: true }
);

PostSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject();
  return data;
};

module.exports = model("Post", PostSchema);
