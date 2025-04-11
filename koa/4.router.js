const Koa = require("./koa");
const Router = require("./middlewares/koa-router");

const koa = new Koa();
const router = new Router();

koa.use(router.routes());

router.get("/hello", async (ctx, next) => {
  ctx.body = "hello";
  console.log(111);
  await next();
});

router.get("/hello", async (ctx, next) => {
  ctx.body = "hello1";
  console.log(222);
});

koa.listen(3344, () => {
  console.log("启动服务");
});
