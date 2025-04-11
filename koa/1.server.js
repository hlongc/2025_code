const Koa = require("./koa");
const path = require("path");
const fs = require("fs");

const koa = new Koa();

koa.use(function (ctx, next) {
  console.log(ctx.query);
  console.log(ctx.request.query);
  console.log(ctx.req.query);
  console.log(ctx.request.req.query);

  ctx.res.setHeader("Content-Type", "text/plain;charset=utf-8");
  ctx.body = fs.createReadStream(path.resolve(__dirname, "1.server.js"));
});

koa.listen(3344, () => {
  console.log("server start on 3344");
});
