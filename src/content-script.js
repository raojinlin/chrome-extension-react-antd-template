import React from 'react';
import ReactDom from 'react-dom/client';
import Content from './components/Content';
import { dispatchMessage } from "./lib/brower";
import Message from "./lib/message";
import { Logger } from "./lib/logger";
import { getConfig } from './lib/config';

const config = getConfig(process.env.ENV);
const logger = Logger.createLogger('ContentScript', config.logger.handler, config.logger.options);


function main() {
  console.log(config);
  const message = new Message(logger);
  // 发送消息并打印响应
  message.sendMessage('ping').then(res => {
    logger.info(res);
  });

  // 监听 reload 消息, 刷新页面
  message.addListener('reload', () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
        window.location.reload();
      }, 1000);
    });
  })

  dispatchMessage(message);

  // 创建React DOM容器
  const container = document.createElement('div');
  // 追加容器到页面
  document.body.prepend(container);
  // 挂载React组件
  ReactDom.createRoot(container).render(<Content />);
}

main();

