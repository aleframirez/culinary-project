const { Schema, model } = require("mongoose");

const CategorieSchema = Schema({
  name: {
    type: String,
    require: [true, "Category name is required"],
    unique: true,
  },
  status: {
    type: Boolean,
    default: true,
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
});

CategorieSchema.methods.toJSON = function () {
  const { __v, status, ...data } = this.toObject();
  return data;
};

module.exports = model("Categorie", CategorieSchema);
