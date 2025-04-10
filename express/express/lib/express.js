const Application = require("./application");

function createApplication() {
  // 工厂模式
  const app = new Application();

  return app;
}

module.exports = createApplication;
