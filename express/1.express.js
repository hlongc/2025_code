const express = require("./express");

const app = express();

app.get("/", (req, res) => {
  res.end("hello world");
});

app.get(
  "/about",
  (req, res, next) => {
    console.log(1);
    next();
  },
  (req, res, next) => {
    console.log(2);
    next();
  }
);

app.get("/about", (req, res, next) => {
  console.log(12);
  res.end("about");
});

app.listen(3344, () => {
  console.log("服务启动成功");
});
