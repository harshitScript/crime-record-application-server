const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/rootDir");

const absolutePath = path.join(rootDir, "logs", "server.log");
const logsWriteStream = fs.createWriteStream(absolutePath);

module.exports = logsWriteStream;
