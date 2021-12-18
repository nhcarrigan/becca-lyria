declare module "precise-memory-rate-limit" {
  class DefaultDict {
    constructor(defaultVal: function): ProxyConstructor;
  }

  class User {
    constructor(
      rate: number,
      maxCalls: number
    ): {
      tokens: number;
      ts: number;
    };
  }

  memoryStore;
}
