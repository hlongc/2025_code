const url = require("url");
const Route = require("./route");
const Layer = require("./layer");
const { http_methods } = require("../common");

function Router() {
  this.stack = [];
}

http_methods.forEach((method) => {
  Router.prototype[method] = function (path, handlers) {
    // 每调用一次get方法就会产生一个route
    const route = new Route();
    const layer = new Layer(path, route.dispatch.bind(route));
    // 保持和route的引用，只有路由才有这个属性
    layer.route = route;
    // 记住用户传入的处理方法
    route[method](handlers);

    this.stack.push(layer);
  };
});

Router.prototype.handle = function (req, res, out) {
  const { pathname } = url.parse(req.url);
  const reqMethod = req.method.toLowerCase();
  let idx = 0;

  const next = () => {
    if (idx >= this.stack.length) return out();
    const layer = this.stack[idx++];
    // 外层只负责匹配路径，route里层匹配方法
    if (layer.match(pathname)) {
      if (!layer.route) {
        // 如果是中间件，直接执行
        layer.handle_request(req, res, next);
      } else if (layer.route.methods[reqMethod]) {
        // 也就是路由的dispatch方法
        layer.handle_request(req, res, next);
      } else {
        next();
      }
    } else {
      next();
    }
  };

  next();
};

Router.prototype.use = function (path, ...handlers) {
  if (typeof path !== "string") {
    handlers.unshift(path);
    // 没传路径给个默认值
    path = "/";
  }

  handlers.forEach((handler) => {
    const layer = new Layer(path, handler);
    this.stack.push(layer);
  });
};

module.exports = Router;
