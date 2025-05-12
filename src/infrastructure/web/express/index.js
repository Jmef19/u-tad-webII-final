const express = require("express");
const configureMiddlewares = require("./middlewares");
const {
  companyRouter,
  userRouter,
  clientRouter,
  projectRouter,
} = require("./routes");

function startWeb() {
  const app = express();

  // Configure middlewares
  configureMiddlewares(app);

  // Configure routes
  app.use("/company", companyRouter);
  app.use("/user", userRouter);
  app.use("/client", clientRouter);
  app.use("/project", projectRouter);

  // Start the server
  const server = startServer(app, process.env.PORT || 3000);

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${process.env.PORT} is already in use`);
      startServer(app, 0);
    }
  });
}

function startServer(app, port) {
  const server = app.listen(port, () => {
    console.log(`Server is listening to port ${server.address().port}`);
  });
  return server;
}

module.exports = startWeb;
