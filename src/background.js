import { Logger, ConsoleHandler } from "./lib/logger";
import Message from "./lib/message";
import {dispatchMessage} from "./lib/brower";

const logger = new Logger('background', new ConsoleHandler());
const message = new Message(logger);

function main() {
  logger.info('hello, background');
}


// 监听ping
message.addListener('ping', (request, sender, sendResponse) => {
  sendResponse('pong');
});


main();

// 消息分发
dispatchMessage(message);
