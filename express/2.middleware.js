const express = require("./express");

const app = express();

app.use(
  "/a",
  (req, res, next) => {
    req.a = 100;
    console.log(1);
    next();
  },
  (req, res, next) => {
    req.a += 100;
    console.log(2);
    next();
  }
);

app.get("/about", (req, res, next) => {
  console.log(req.a, "hello");
  res.end("about");
});

app.get("/", (req, res) => {
  res.end("hello world");
});

app.listen(3344, () => {
  console.log("服务启动成功");
});
