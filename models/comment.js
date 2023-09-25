const { Schema, model } = require("mongoose");

const CommentSchema = Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", //
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    totalLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = model("Comment", CommentSchema);
