const { pathToRegexp } = require("path-to-regexp");
function Layer(path, handler) {
  this.path = path;
  const { keys, regexp } = pathToRegexp(this.path);
  this.regexp = regexp;
  this.keys = keys;
  this.handler = handler;
}

Layer.prototype.match = function (pathname) {
  if (pathname === this.path) return true;
  if (this.route) {
    // 当前是路由
    const matches = pathname.match(this.regexp);
    if (matches) {
      const values = matches.slice(1);
      this.params = this.keys.reduce(
        (memo, cur, index) => ((memo[cur.name] = values[index]), memo),
        {}
      );

      return true;
    }
    return false;
  } else {
    // 如果当前是中间件，那么需要增加下面的逻辑
    if (this.path === "/") return true;
    // /hello/world  /hello
    return pathname.startsWith(this.path + "/");
  }
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
