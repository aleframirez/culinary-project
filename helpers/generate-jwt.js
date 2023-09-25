const JwT = require("jsonwebtoken");

const generateJwT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    JwT.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("Could not add token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJwT,
};
