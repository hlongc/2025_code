const Koa = require("./koa");

const koa = new Koa();

function sleep(n) {
  return new Promise((resolve) => {
    setTimeout(resolve, n);
  });
}

koa.use(async (ctx, next) => {
  console.log(1);
  ctx.body = 1;
  await next();
  console.log(2);
  ctx.body = 2;
});

koa.use(async (ctx, next) => {
  console.log(3);
  ctx.body = 3;
  await sleep(2000);
  await next();
  console.log(4);
  ctx.body = 4;
});

koa.use(async (ctx, next) => {
  console.log(5);
  ctx.body = 5;
  await next();
  console.log(5);
  ctx.body = 5;
});

koa.on("error", (err) => {
  console.log(err);
});

koa.listen(3344, () => {
  console.log("服务启动");
});
