const { Router } = require("express");
const { check } = require("express-validator");

const { uploadFileValidator, validateFields } = require("../middlewares");
const { loadFile, updateCloudinaryImage, showImage, updateImage } = require("../controller");
const { allowedCollections } = require("../helpers");

const router = Router();

router.get(
  "/:collection/:id",
  [
    check("id", "Not a valid ID").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["user", "post"])
    ),
    validateFields,
  ],
  showImage
);

router.post("/", uploadFileValidator, loadFile);

router.put(
  "/:collection/:id",
  [
    uploadFileValidator,
    check("id", "Not a valid ID").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["user", "post"])
    ),
    validateFields,
  ],
  updateCloudinaryImage
  // updateImage
);

module.exports = router;
