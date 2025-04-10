const http = require("http");
const Router = require("./Router");

function Application() {
  this.router = new Router();
}

Application.prototype.get = function (path, ...handlers) {
  this.router.get(path, handlers);
};

Application.prototype.listen = function (...args) {
  const server = http.createServer((req, res) => {
    function done() {
      res.end(`ronnie Can1not ${req.method.toUpperCase()} ${req.url}`);
    }

    this.router.handle(req, res, done);
  });

  server.listen(...args);
};

module.exports = Application;
