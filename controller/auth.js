const { response, json } = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateJwT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");
const { sendEmail } = require("../helpers/send-email");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "User / Password incorrect - email",
      });
    }

    // If the user status is false, send an error
    if (!user.status) {
      return res.status(400).json({
        msg: "User / Password incorrect - status: false",
      });
    }

    // Check for the password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "User / Password incorrect - Password",
      });
    }

    // Generate JwT
    const token = await generateJwT(user.id);

    res.status(200).json({
      msg: "Login Ok",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, email, img } = await googleVerify(id_token);
    let user = await User.findOne({ email });

    // If there is no user with that email, we create it.
    if (!user) {
      const data = {
        name,
        email,
        password: ":D",
        img,
        role: "USER_ROLE",
        google: true,
      };

      user = new User(data);
      await user.save();
      sendEmail(name, email);
    }

    // If the user status is false, send an error
    if (!user.status) {
      return res.status(401).json({
        msg: "Talk to administrator, user blocked",
      });
    }

    // Generate JwT
    const token = await generateJwT(user.id);

    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "The token could not be verified",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
