const { METHODS } = require("http");

const http_methods = METHODS.map((method) => method.toLowerCase());

module.exports.http_methods = http_methods;
