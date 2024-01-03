import React from 'react';
import ReactDom from 'react-dom/client';
import { getURL } from "./lib/brower";
import Message from "./lib/message";
import {Logger, ConsoleHandler} from "./lib/logger";
import Example from './components/Example';
import { getConfig } from './lib/config';

const config = getConfig(process.env.NODE_ENV);
const logger = Logger.createLogger('ContentScript', config.logger.handler, config.logger.options);

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

