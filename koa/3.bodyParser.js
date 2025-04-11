const Koa = require("./koa");
const bodyParser = require("./middlewares/body-parser");
const path = require("path");
const fs = require("fs");

const koa = new Koa();

koa.use(bodyParser());

koa.use(function (ctx, next) {
  console.log(ctx.request.body);
  ctx.body = "hello";
});

koa.listen(3344, () => {
  console.log("server start on 3344");
});
