const { Router } = require("express");
const { check } = require("express-validator");

const {
  getCategories,
  getCategoriesById,
  postCategorie,
  putCategorie,
  deleteCategorie,
} = require("../controller");

const { existCategorieId } = require("../helpers");

const { validateFields, validateJwT, isAdminRole } = require("../middlewares");

const router = Router();

// GET Categories
router.get("/", getCategories);

// GET Categories by id
router.get(
  "/:id",
  [
    check("id", " Not a valid id").isMongoId(),
    check("id").custom(existCategorieId),
    validateFields,
  ],
  getCategoriesById
);

// POST Categorie
router.post(
  "/",
  [
    validateJwT,
    check("name", "Name is required").not().isEmpty(),
    validateFields,
  ],
  postCategorie
);

// PUT Categorie
router.put(
  "/:id",
  [
    validateJwT,
    check("name", "Name is required").not().isEmpty(),
    check("id").custom(existCategorieId),
    validateFields,
  ],
  putCategorie
);

// DELETE Categorie
router.delete(
  "/:id",
  [
    validateJwT,
    isAdminRole,
    check("id", "Not a valid id").isMongoId(),
    check("id").custom(existCategorieId),
    validateFields,
  ],
  deleteCategorie
);

module.exports = router;
