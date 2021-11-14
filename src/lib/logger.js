import moment from "moment";

const LOG_LEVEL_INFO = 'INFO';
const LOG_LEVEL_ERROR = 'ERROR';
const LOG_LEVEL_DEBUG = 'DEBUG';
const LOG_LEVEL_WARN = 'WARN';

export class AbstractLoggerHandler {
  emit(msg, level) {
    throw new Error("method emit(msg, level) not implemented.");
  }
}


export class ConsoleHandler extends AbstractLoggerHandler {
  emit(msg, level='INFO') {
    switch (level) {
      case LOG_LEVEL_INFO:
        console.info(msg);
        break;
      case LOG_LEVEL_DEBUG:
        console.debug(msg);
        break;
      case LOG_LEVEL_ERROR:
        console.error(msg);
        break;
      default:
        console.log(msg);
        break;
    }
  }
}

export class HttpHandler extends AbstractLoggerHandler {
  constructor(url) {
    super();
    this.url = url;
  }

  emit(msg, level) {
    if (!level) {
      level = 'INFO';
    }

    fetch(`${this.url}/${level}?message=${encodeURIComponent(msg)}`);
  }
}

export class Logger {
  static DEBUG = LOG_LEVEL_DEBUG;

  static INFO = LOG_LEVEL_INFO;

  static ERROR = LOG_LEVEL_ERROR;

  /**
   * @param name {string}
   * @param handler {AbstractLoggerHandler}
   */
  constructor(name, handler) {
    this.loggerName = name;
    this.handler = handler;
    this._debug = false;
  }

  setDebug(debug) {
    this._debug = debug;
  }

  setLoggerHandler(handler) {
    if (handler instanceof AbstractLoggerHandler) {
      this.handler = handler;
    }
  }

  static getFormattedMessage(loggerName, msg, level) {
    return `${moment().format()} ${loggerName} [${level}]: ${msg}`;
  }

  static messagesToString(...msg) {
    return msg.map(item => {
      if (item instanceof Error) {
        return item;
      }

      return typeof item === 'object' ? JSON.stringify(item) : item;
    }).join(', ');
  }

  info(...msg) {
    this.handler.emit(Logger.getFormattedMessage(this.loggerName, Logger.messagesToString(...msg), Logger.INFO), 'INFO');
  }

  debug(...msg) {
    if (!this._debug) {
      return;
    }

    this.handler.emit(Logger.getFormattedMessage(this.loggerName, Logger.messagesToString(...msg), Logger.DEBUG), 'DEBUG');
  }

  error(...msg) {
    this.handler.emit(Logger.getFormattedMessage(this.loggerName, Logger.messagesToString(...msg), Logger.ERROR), 'ERROR');
  }

  static createLogger(loggerName) {
    return new Logger(loggerName, new ConsoleHandler());
  }
}
