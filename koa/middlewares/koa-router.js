class Layer {
  constructor(path, method, handler) {
    this.path = path;
    this.method = method;
    this.handler = handler;
  }

  match(path, method) {
    return this.path === path && this.method === method;
  }
}

class Router {
  constructor() {
    this.stack = [];
  }

  compose(layers, ctx, out) {
    console.log(layers);
    let idx = -1;

    const dispatch = (i) => {
      if (i === layers.length) return out();
      if (idx === i) return Promise.reject(new Error("重复调用next"));

      const handler = layers[i].handler;

      try {
        return Promise.resolve(handler(ctx, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return dispatch(0);
  }

  routes() {
    return async (ctx, next) => {
      const path = ctx.path;
      const method = ctx.req.method.toLowerCase();
      const layers = this.stack.filter((layer) => layer.match(path, method));

      return this.compose(layers, ctx, next);
    };
  }

  get(path, handler) {
    this.stack.push(new Layer(path, "get", handler));
  }

  post(path, handler) {
    this.stack.push(new Layer(path, "post", handler));
  }
}

module.exports = Router;
