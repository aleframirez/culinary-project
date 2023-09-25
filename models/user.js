const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: {
    type: String,
    require: [true, "Name is required"],
  },
  username: {
    type: String,
    require: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    require: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Password is required"],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    require: true,
    default: "USER_ROLE",
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
  recipes: [{
    type: Schema.Types.ObjectId,
    ref: "Recipe",
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

module.exports = model("User", UserSchema);
