function Layer(path, handler) {
  this.path = path;
  this.handler = handler;
}

Layer.prototype.match = function (pathname) {
  if (pathname === this.path) return true;
  // 如果当前是中间件，那么需要增加下面的逻辑
  if (!this.route) {
    if (this.path === "/") return true;
    // /hello/world  /hello
    return pathname.startsWith(this.path + "/");
  }

  return false;
};

Layer.prototype.handle_error = function (err, req, res, next) {
  if (this.handler.length === 4) {
    this.handler(err, req, res, next);
  } else {
    next(err);
  }
};

Layer.prototype.handle_request = function (req, res, next) {
  this.handler(req, res, next);
};

module.exports = Layer;
