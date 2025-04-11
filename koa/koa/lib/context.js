const context = {};

class Delegate {
  constructor(target, property) {
    this.target = target;
    this.property = property;
  }

  getter(key) {
    const that = this;
    this.target.__defineGetter__(key, function () {
      return this[that.property][key];
    });

    return this;
  }

  setter(key) {
    const that = this;
    this.target.__defineSetter__(key, function (val) {
      this[that.property][key] = val;
    });

    return this;
  }

  access(key) {
    return this.getter(key).setter(key);
  }
}

function delegate(target, property) {
  return new Delegate(target, property);
}
// 访问到context的直接代理到request上
delegate(context, "request").access("path").access("query").access("url");

delegate(context, "response").access("body");

module.exports = context;
