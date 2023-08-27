import React from 'react';
import ReactDom from 'react-dom/client';
import { getURL } from "./lib/brower";
import Message from "./lib/message";
import {Logger, ConsoleHandler} from "./lib/logger";
import Example from './components/Example';

const logger = new Logger('ContentScript', new ConsoleHandler());

function ContentScript({ }) {
  return (
    <div>
      <div>
        <img src={getURL('images/chrome-icon.png')} style={{width: 50}} />
      </div>
      <Example />
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
  ReactDom.createRoot(container).render(<ContentScript />);
}

main();

