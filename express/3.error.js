const express = require("./express");

const app = express();

app.use(
  "/",
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

app.get(
  "/about",
  (req, res, next) => {
    next("world");
  },
  (req, res, next) => {
    res.end("success");
  }
);

app.get("/", (req, res) => {
  res.end("hello world");
});

app.use((err, req, res, next) => {
  res.end(err + "abc");
});

app.listen(3344, () => {
  console.log("服务启动成功");
});
