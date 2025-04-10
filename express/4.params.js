const express = require("./express");

const app = express();

app.get("/hello/:name/:id/wrold", (req, res, next) => {
  res.end(JSON.stringify(req.params));
});

app.listen(3344, () => {
  console.log("服务启动成功");
});
