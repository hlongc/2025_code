const context = {};

class Delegate {
  constructor(target, property) {
    this.target = target;
    this.property = property;
  }

  access(key) {
    const that = this;
    this.target.__defineGetter__(key, function () {
      return this[that.property][key];
    });

    return this;
  }
}

function delegate(target, property) {
  return new Delegate(target, property);
}
// 访问到context的直接代理到request上
delegate(context, "request").access("path").access("query").access("url");

module.exports = context;
