export default class ClientNotInitialized extends Error {
  constructor() {
    super("client not initialized");
  }
}
