const url = require("url");
const Route = require("./route");
const Layer = require("./layer");

function Router() {
  this.stack = [];
}

Router.prototype.get = function (path, handlers) {
  // 每调用一次get方法就会产生一个route
  const route = new Route();
  const layer = new Layer(path, route.dispatch.bind(route));
  // 保持和route的引用
  layer.route = route;
  // 记住用户传入的处理方法
  route.get(handlers);

  this.stack.push(layer);
};

Router.prototype.handle = function (req, res, out) {
  const { pathname } = url.parse(req.url);

  let idx = 0;

  const next = () => {
    if (idx >= this.stack.length) return out();
    const layer = this.stack[idx++];

    // 外层只负责匹配路径，route里层匹配方法
    if (layer.match(pathname)) {
      // 也就是路由的dispatch方法
      layer.handle_request(req, res, next);
    } else {
      next();
    }
  };

  next();
};

module.exports = Router;
