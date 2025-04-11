const EventEmitter = require("events");
const http = require("http");
const Stream = require("stream");
const context = require("./context");
const request = require("./request");
const response = require("./response");

class Application extends EventEmitter {
  constructor() {
    super();
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.middlewares = [];
  }

  use(fn) {
    this.middlewares.push(fn);
  }

  createContext(req, res) {
    // 每个请求都应该有独立的上下文
    const ctx = Object.create(this.context);
    const request = Object.create(this.request);
    const response = Object.create(this.response);

    ctx.req = req;
    ctx.request = request;
    ctx.request.req = req;

    ctx.res = res;
    ctx.response = response;
    ctx.response.res = res;

    return ctx;
  }

  compose(ctx) {
    let idx = -1;

    const dispatch = (i) => {
      if (i === this.middlewares.length) return Promise.resolve();
      if (idx === i) return Promise.reject(new Error("重复调用next"));
      const middleware = this.middlewares[i];

      try {
        return Promise.resolve(middleware(ctx, () => dispatch(i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return dispatch(0);
  }

  handler_request = (req, res) => {
    const ctx = this.createContext(req, res);

    res.statusCode = 404;

    this.compose(ctx)
      .then(() => {
        const body = ctx.body;

        if (body === undefined) {
          res.end("Not Found");
        } else if (body instanceof Stream) {
          body.pipe(res);
        } else if (typeof body === "object" && body !== null) {
          res.end(JSON.stringify(body));
        } else {
          res.end(body.toString());
        }
      })
      .catch((e) => {
        this.emit("error", e);
      });
  };

  listen(...args) {
    const server = http.createServer(this.handler_request);

    server.listen(...args);
  }
}

module.exports = Application;
