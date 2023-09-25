const express = require("express");
const cors = require("cors");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const { dbConnection } = require("../database/config.db");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      post: "/api/post",
      auth: "/api/auth",
      users: "/api/users",
      search: "/api/search",
      uploads: "/api/uploads",
      comments: "/api/comments",
      categories: "/api/categories",
    };

    // Connect to DB
    this.connectDB();

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
  }

  // Connect to DB
  async connectDB() {
    await dbConnection();
  }

  // Middlewares
  middlewares() {
    // Cors
    this.app.use(cors());

    // Reading and parsing the body
    this.app.use(express.json());

    // Public directory
    this.app.use(express.static("public"));

    // FileUpload - Load file
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  // Routes
  routes() {
    this.app.use(this.paths.auth, require("../routes/auth.routes.js"));
    this.app.use(this.paths.post, require("../routes/post.routes.js"));
    this.app.use(this.paths.users, require("../routes/user.routes.js"));
    this.app.use(
      this.paths.categories,
      require("../routes/categorie.routes.js")
    );
    this.app.use(this.paths.uploads, require("../routes/uploads.routes.js"));
    this.app.use(this.paths.comments, require("../routes/comments.routes.js"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running in port:".underline, this.port.yellow);
    });
  }
}

module.exports = Server;
