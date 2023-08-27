import { sendMessageToTabs, sendMessage } from "./brower";


export default class Message {
  constructor(logger) {
    this.listeners = [];
    this.logger = logger;
  }

  /**
   * 发送消息到后台
   * @param subject
   * @param data
   * @return {Promise<unknown>}
   */
  async sendMessage(subject, data) {
    this.logger.info(`send message ${subject}, ${data}`);
    return sendMessage({subject, data});
  }

  /**
   * 发送消息到查询到的tabs
   * @param query {{object}}
   * @param subject {string}
   * @param data {*}
   * @return {Promise<unknown[]>}
   */
  async sendMessageToTabs(query, subject, data) {
    return sendMessageToTabs(query, {subject, data});
  }

  /**
   * 添加消息监听
   * @param subject {string} 消息主题
   * @param listener {(function(request: {subject: string, data: *}, sender: string, sendResponse: (function(response: *))))}
   * @return {Message}
   */
  addListener(subject, listener) {
    if (!this.listeners[subject]) {
      this.listeners[subject] = [];
    }

    this.listeners[subject].push(listener);
    return this;
  }

  /**
   * 删除监听者
   * @param subject
   * @param listener
   * @return {boolean}
   */
  removeListener(subject, listener) {
    if (!this.listeners[subject]) {
      return false;
    }

    const listenerPos = this.listeners[subject].indexOf(listener);
    if (listenerPos === -1) {
      return false;
    }

    this.listeners[subject].splice(listenerPos, 1);
    return true;
  }

  /**
   * 分发消息改subject的监听者
   * @param request {{subject: string, data}}
   * @param sender {string}
   * @param sendResponse {(function(res: *))}
   * @return {Promise<boolean>}
   */
  dispatch(request, sender, sendResponse) {
    const { subject, data } = request;
    const listeners = this.listeners[subject];
    if (!listeners || !listeners.length) {
      sendResponse(null);
      return false;
    }

    this.logger.info(`dispatch ${subject} to ${listeners.length} listeners`);
    for (let i = 0; i < listeners.length; i++) {
      const handler = listeners[i];
      handler(request, sender, sendResponse);
    }

    return true;
  }
}
