const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { uploadFile } = require("../helpers");

const { User, Post } = require("../models");

const loadFile = async (req = request, res = response) => {
  try {
    const name = await uploadFile(req.files, undefined, "imgs");
    res.json({ name });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

const updateImage = async (req = request, res = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "user":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no User with this id ${id}`,
        });
      }
      break;
    case "Post":
      model = await Post.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no Post with this id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Seems that i forgot something",
      });
  }

  if (model.img) {
    const cutName = model.img.split("/");
    const extension = cutName[cutName.length - 1];
    console.log(extension);
    // const pathImage = path.join(__dirname, "../uploads", collection, extension);
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      collection,
      // model.img
      extension
    );
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const name = await uploadFile(req.files, undefined, collection);
  model.img - name;

  await model.save();

  res.json(model);
};

const updateCloudinaryImage = async (req = request, res = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "user":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no User with this id ${id}`,
        });
      }
      break;
    case "post":
      model = await Post.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no Post with this id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Seems that i forgot something",
      });
  }

  // Delete previus images
  if (model.img) {
    const nameArr = model.img.split("/");
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  model.img = secure_url;

  await model.save();

  res.json(model);
};

const showImage = async (req = request, res = response) => {
  const { id, collection } = req.params;
  let model;

  switch (collection) {
    case "user":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no User with this id ${id}`,
        });
      }
      break;
    case "post":
      model = await Post.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no Post with this id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Seems that i forgot something",
      });
  }

  if (model.img) {
    const photo = cloudinary.image(model.img, {
      /* Aqui podemos modificar la img,
      Mas info en: https://cloudinary.com/documentation/node_image_manipulation */
      width: 700,
    });
    res.send(photo);
  } else {
    const pathImage = path.join(__dirname, "../assets/no-image.jpg");
    res.sendFile(pathImage);
  }
};

module.exports = {
  loadFile,
  updateCloudinaryImage,
  showImage,
  updateImage,
};
