const response = {
  _body: undefined,
  set body(val) {
    this.res.statusCode = 200;
    this._body = val;
  },
  get body() {
    return this._body;
  },
};

module.exports = response;
