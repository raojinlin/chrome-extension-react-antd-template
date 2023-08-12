# Chrome Extension React Antd Template


这是一个基于React和Ant Desigin UI库的Chrome插件模板项目。该模板封装了一些常见的基础库，如日志和消息通信，可用于快速构建React插件。

版本信息：
1. Ant design: 5.8.2
2. React: 18.2.0


## 特性
* 支持react
* 支持less
* 支持ts
* 封装了通用的消息通信
* 支持日志采集
* 快速搭建项目
* 支持环境配置(development/production)
* 使用promise发送/等待消息响应

## 使用
node版本在10以上。

1. 克隆本项目
```shell
git clone https://github.com/raojinlin/chrome-extension-react-antd-template.git
cd chrome-extension-react-antd-template
```
2. 构建插件
```bash
npm install
npm run build
```

3. 构建后会在```extension```生成相应的文件。在浏览器加载插件就可以运行了。

![](./screenshot/install.png)

## 截图

Popup

![./screenshot/popup.png](./screenshot/popup.png)

配置页

![](./screenshot/options.png)

内容脚本注入

![](./screenshot/content-script.png)


## 项目布局

### ```/src/backgorund.js```
后台脚本入口


### ```/src/content-scripts.js```

内容脚本入口

### ```/src/content-options.js```

插件配置入口

### ```/src/components/```

一些通用的react组件

### ```/src/lib```

一些通用的库，如日志、消息通信、浏览器接口相关的函数

#### ```/src/lib/message.js```

消息类

监听消息：

```js
const message = new Message();

message.addListener('ping', function (request, sender, sendResponse) {
  sendResponse('pong');
});

import { dispatchMessage } from "./brower";


// 分发消息
dispatchMessage(message);
```

发送消息:
```js
const message = new Message();
message.sendMessage('ping').then(response => {
    console.log('pong');
});
```

#### ```/src/lib/logger.js```

日志类，支持console和http方式记录日志。

```js
import { Logger, HttpHandler, ConsoleHandler } from "./lib/logger";

// 使用HTTP记录日志到服务器
const logger = new Logger('HTTP', new HttpHandler('https://log.youdomain.com/collect/'));
logger.info('some message from client');

// 记录日志到控制台
const consoleLogger = new Logger('CONSOLE', new ConsoleHandler());
consoleLogger.info('message to console');

```

### 在content-script使用插件内的资源（文件、html、css等）

```js
import { getURL } from "./brower";

getURL('/images/chrome-icon.png');
```
