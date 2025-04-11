const EventEmitter = require("events");
const http = require("http");
const context = require("./context");
const request = require("./request");
const response = require("./response");

class Application extends EventEmitter {
  constructor() {
    super();
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }

  use(fn) {
    this.middleware = fn;
  }

  handler_request = (req, res) => {
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

    this.middleware(ctx);
  };

  listen(...args) {
    const server = http.createServer(this.handler_request);

    server.listen(...args);
  }
}

module.exports = Application;
