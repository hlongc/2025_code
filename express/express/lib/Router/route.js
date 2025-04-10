const Layer = require("./layer");

function Route() {
  this.stack = [];
}

Route.prototype.get = function (handlers) {
  handlers.forEach((handler) => {
    const layer = new Layer("xxxx", handler);
    layer.method = "get";
    this.stack.push(layer);
  });
};

Route.prototype.dispatch = function (req, res, out) {
  let idx = 0;

  const next = () => {
    if (idx >= this.stack.length) return out();
    const layer = this.stack[idx++];

    // route里层只负责匹配方法，外层负责匹配路径
    if (layer.method === req.method.toLowerCase()) {
      layer.handle_request(req, res, next);
    } else {
      next();
    }
  };

  next();
};

module.exports = Route;
