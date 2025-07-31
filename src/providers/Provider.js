export default class Provider {
  constructor(name, type, mongoModel, BASE_URL, methods = {}) {
    this.name = name;
    this.type = type;
    this.mongoModel = mongoModel;
    this.BASE_URL = BASE_URL;
    Object.assign(this, methods);
  }
}
