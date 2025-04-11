const Koa = require("koa");

const koa = new Koa();

koa.use(function (ctx, next) {
  console.log(ctx.query);
  console.log(ctx.request.query);
  console.log(ctx.req.query);
  console.log(ctx.request.req.query);

  ctx.body = "hello";
});

koa.listen(3344, () => {
  console.log("server start on 3344");
});
