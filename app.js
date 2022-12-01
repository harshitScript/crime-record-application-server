//? GLOBAL IMPORTS --------------------------------------------------------------------------
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { config } = require("dotenv");
const app = express();
config();

//? LOCAL IMPORTS ----------------------------------------------------------------------------
const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorHandlingMiddleware = require("./middleware/errorHandlingMiddleware");
const logsWriteStream = require("./logs/logs.config");
const generalRoutes = require("./routes/generalRoutes");

//? MIDDLEWARE(s) ----------------------------------------------------------------------------
app.use(helmet());
app.use(compression());
app.use(
  process.env.APP_PHASE === "PROD"
    ? morgan("combined", { stream: logsWriteStream })
    : (req, res, next) => next()
);
app.use("/general", generalRoutes);
app.use(notFoundMiddleware);
app.use(errorHandlingMiddleware);

//? SERVER -----------------------------------------------------------------------------------
app.listen(process.env.PORT || 4000, (err) => {
  if (err) {
    console.log(
      `Unable to start ${process.env.SERVER_NAME} in ${process.env.APP_PHASE} mode. <<<`
    );
    return;
  }
  console.log(
    `${process.env.SERVER_NAME} started on port:${process.env.PORT} in ${process.env.APP_PHASE} mode. >>>`
  );
  return;
});
