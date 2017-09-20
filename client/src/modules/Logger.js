class Logger {
  static log(json) {
    console.log(json);
    window._LTracker.push(json);
  }

  static logInfo(json) {
    Logger.log(json);
  }

  static logWarn(json) {
    Logger.log(json);
  }

  static logError(json, error) {

    const copy = Object.assign({}, json);
    copy.error = error.message || error;
    Logger.log(copy);
  }
}

export default Logger;
