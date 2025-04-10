const http = require("http");
const Router = require("./Router");
const { http_methods } = require("./common");

function Application() {}

Application.prototype.lazy_router = function () {
  if (!this.router) {
    this.router = new Router();
  }
};

http_methods.forEach((method) => {
  Application.prototype[method] = function (path, ...handlers) {
    this.lazy_router();
    this.router[method](path, handlers);
  };
});

Application.prototype.listen = function (...args) {
  this.lazy_router();

  const server = http.createServer((req, res) => {
    function done() {
      res.end(`ronnie Can1not ${req.method.toUpperCase()} ${req.url}`);
    }

    this.router.handle(req, res, done);
  });

  server.listen(...args);
};

module.exports = Application;
