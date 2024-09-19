import { formatISO } from 'date-fns';

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
  constructor(options) {
    super(options);
  }

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


class LoggerFormatter {
  format(loggerName, level, msg) {}
}


class DefaultFormatter extends LoggerFormatter {
  format(loggerName, msg, level) {
    return `${formatISO(new Date)} ${loggerName} [${level}]: ${msg}`;
  }
}


class JSONFormatter extends LoggerFormatter {
  format(loggerName, msg, level) {
    return {
      time: formatISO(new Date),
      name: loggerName,
      level,
      msg
    }
  }
}


export class HttpHandler extends AbstractLoggerHandler {
  constructor(options) {
    super(options);
    this.options = options;
    if (this.options.format === 'json') {
      this.formatter = new JSONFormatter();
    }
  }

  emit(msg, level) {
    if (!level) {
      level = 'INFO';
    }

    fetch(this.options.url, {
      method: this.options.method || 'POST',
      body: JSON.stringify(msg),
      headers: {
        'content-type': 'application/json',
      }
    })
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
    this.formatter = new DefaultFormatter();
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
    return `${formatISO(new Date)} ${loggerName} [${level}]: ${msg}`;
  }

  static messageStringify(...msg) {
    return msg.map(item => {
      if (item instanceof Error) {
        return item;
      }

      return typeof item === 'object' ? JSON.stringify(item) : item;
    }).join(', ');
  }

  info(...msg) {
    this.handler.emit(this.formatter.format(this.loggerName, Logger.messageStringify(...msg), Logger.INFO), 'INFO');
  }

  debug(...msg) {
    if (!this._debug) {
      return;
    }

    this.handler.emit(this.formatter.format(this.loggerName, Logger.messageStringify(...msg), Logger.DEBUG), 'DEBUG');
  }

  error(...msg) {
    this.handler.emit(this.formatter.format(this.loggerName, Logger.messageStringify(...msg), Logger.ERROR), 'ERROR');
  }

  static createLogger(loggerName, handlerName, handlerOptions) {
    const handlers = {console: ConsoleHandler, http: HttpHandler};
    if (!handlerName) {
      handlerName = 'console';
    }

    const logger = new Logger(loggerName, new handlers[handlerName](handlerOptions));
    if (handlerOptions?.formatter === 'json') {
      logger.formatter = new JSONFormatter();
    }

    return logger;
  }
}
