const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

function configureMiddlewares(app) {
  app.use(express.static(path.resolve(__dirname, "../public")));
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
  app.use(
    fileUpload({
      limits: { fileSize: 10 * 1024 * 1024 },
      abortOnLimit: true,
      createParentPath: true,
    })
  );
}

module.exports = configureMiddlewares;
