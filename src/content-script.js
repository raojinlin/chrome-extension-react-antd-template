import React from 'react';
import ReactDom from 'react-dom';
import { getURL } from "./lib/brower";
import Message from "./lib/message";
import {Logger, ConsoleHandler} from "./lib/logger";

const logger = new Logger('ContentScript', new ConsoleHandler());

function App({ }) {
  return (
    <div>
      Content script
      <img src={getURL('images/chrome-icon.png')} />
    </div>
  );
}


function main() {
  const container = document.createElement('div');

  // 发送消息并打印响应
  new Message(logger).sendMessage('ping').then(res => {
    logger.info(res);
  });

  document.body.prepend(container);
  ReactDom.render(<App />, container);
}

main();

