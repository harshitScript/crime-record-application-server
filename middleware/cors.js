const cors = (req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://crime-record-application-client.vercel.app/"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
};

module.exports = cors;
