const { validateFields } = require("./validate-fields");
const { validateJwT } = require("./validate-jwt");
const { haveRole, isAdminRole } = require("./validate-role");
const { uploadFileValidator } = require("./validate-file");

module.exports = {
  validateFields,
  validateJwT,
  haveRole,
  isAdminRole,
  uploadFileValidator,
};
