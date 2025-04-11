module.exports = function () {
  return async function (ctx, next) {
    ctx.request.body = await new Promise((resolve) => {
      const buffer = [];

      ctx.req.on("data", (data) => {
        buffer.push(data);
      });

      ctx.req.on("end", () => {
        resolve(Buffer.concat(buffer).toString());
      });
    });

    return next();
  };
};
