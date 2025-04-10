const Application = require("./application");
const Router = require("./Router");

function createApplication() {
  // 工厂模式
  const app = new Application();

  return app;
}

createApplication.Router = Router;

module.exports = createApplication;
