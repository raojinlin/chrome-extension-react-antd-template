import { Logger, ConsoleHandler } from "./lib/logger";
import Message from "./lib/message";
import { dispatchMessage, sendMessageToTabs } from "./lib/brower";
import { LruCacheWithExpireWithSerialization } from './lib/cache';
import { getConfig } from "./lib/config";

const logger = new Logger('background', new ConsoleHandler());
const message = new Message(logger);
const config = getConfig(process.env.NODE_ENV);
const isDev = process.env.NODE_ENV === 'development';

function main() {
  logger.info('hello, background');
  // 监听代码更新
  if (isDev) {
    const eventSource = new EventSource(`http://localhost:${config.plugins.reload.port}/`);
    eventSource.onmessage = data => {
      if (data.data === 'reload') {
        logger.info('reload extension ...')
        sendMessageToTabs({ currentWindow: true }, { 'subject': 'reload' }).then(r => {
          chrome.runtime.reload();
        }).catch((err) => {
          logger.error('send message to tabs error: ', err.message);
        });
      }
    };

    eventSource.onerror = error => {
      logger.error(error);
    };
  }
}

addEventListener('active', e => {
  logger.info(e)
})

const cache = new LruCacheWithExpireWithSerialization('service-woker', 100, 3);

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== "install" && details.reason !== "update") {
    return;
  }
});

// 监听ping
message.addListener('ping', (request, sender, sendResponse) => {
  cache.set('ping', 'pong', 7200);
  sendResponse('pong');
});


main();

// 消息分发
dispatchMessage(message);
