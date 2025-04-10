const url = require("url");
const Route = require("./route");
const Layer = require("./layer");
const { http_methods } = require("../common");

const proto = {};

function Router() {
  const route = (req, res, next) => {
    route.handle(req, res, next);
  };
  route.stack = [];

  Object.setPrototypeOf(route, proto);

  // 返回的是引用类型时，会被当做当前的this
  // 通过这种改造可以同时当做类和方法来使用
  return route;
}

http_methods.forEach((method) => {
  proto[method] = function (path, handlers) {
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

proto.handle = function (req, res, out) {
  const { pathname } = url.parse(req.url);
  const reqMethod = req.method.toLowerCase();
  let idx = 0;

  // 进入中间件时删除当前path
  let removed = "";

  const next = (err) => {
    if (idx >= this.stack.length) return out();
    const layer = this.stack[idx++];

    if (removed) {
      // 重新进入时需要恢复正常的url
      req.url = removed + req.url;
      removed = "";
    }

    if (err) {
      // 当前有错误，需要传递给错误处理中间件
      if (!layer.route && layer.handler.length === 4) {
        // 函数参数是4个的才是错误处理中间件
        layer.handle_error(err, req, res, next);
      } else {
        // 如果当前不是那么就往下面找
        next(err);
      }
    } else {
      // 外层只负责匹配路径，route里层匹配方法
      if (layer.match(pathname)) {
        req.params = layer.params;

        if (!layer.route) {
          // 当前为中间件
          if (layer.handler.length === 4) {
            // 如果当前是错误中间件，那么跳过
            next();
          } else {
            if (layer.path !== "/") {
              removed = layer.path;
              // 移除中间件的路径，好匹配嵌套的路由系统
              req.url = req.url.slice(removed.length);
            }
            // 如果是正常中间件，直接执行
            layer.handle_request(req, res, next);
          }
        } else if (layer.route.methods[reqMethod]) {
          // 也就是路由的dispatch方法
          layer.handle_request(req, res, next);
        } else {
          next();
        }
      } else {
        next();
      }
    }
  };

  next();
};

proto.use = function (path, ...handlers) {
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
