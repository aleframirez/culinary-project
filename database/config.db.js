const mongoose = require("mongoose");
const colors = require("colors")

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database Online".brightYellow);
  } catch (error) {
    console.log(error);
    throw new Error("Error starting database.");
  }
};

module.exports = {
  dbConnection,
};
