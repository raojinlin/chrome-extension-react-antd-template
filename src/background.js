import { Logger, ConsoleHandler } from "./lib/logger";
import Message from "./lib/message";
import {dispatchMessage} from "./lib/brower";
import { LruCacheWithExpireWithSerialization } from './lib/cache';

const logger = new Logger('background', new ConsoleHandler());
const message = new Message(logger);

function main() {
  logger.info('hello, background');
}

addEventListener('active', e => {
  console.log(e);
})

const cache = new LruCacheWithExpireWithSerialization('service-woker', 100, 3);

console.log(cache);

chrome.runtime.onInstalled.addListener((details) => {
  if(details.reason !== "install" && details.reason !== "update") return;
});

// 监听ping
message.addListener('ping', (request, sender, sendResponse) => {
  cache.set('ping', 'pong', 7200);
  sendResponse('pong');
});


main();

// 消息分发
dispatchMessage(message);
