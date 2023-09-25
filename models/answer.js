const { Schema, model } = require("mongoose");

const AnswerSchema = Schema(
  {
    content: {
      type: String,
      require: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Answer", AnswerSchema);
