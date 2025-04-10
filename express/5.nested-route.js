const express = require("./express");

const app = express();

const user = require("./route/user");

app.use("/user", user);

app.listen(3344, () => {
  console.log("服务启动成功");
});
