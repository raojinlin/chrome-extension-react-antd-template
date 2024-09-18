const http = require('http');


const pluginName = 'ReloadPlugin';

const defaultHeaders = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Access-Control-Allow-Origin': '*',
};

const defaultPort = 8082;


/**
 * @typedef {Object} ReloadPluginOptions
 * @property {RequestInit.headers|undefined} headers 响应头
 * @property {Number|undefined} port 监听端口
 */

class ReloadPlugin {
  /**
   * @param {ReloadPluginOptions} options
   */
  constructor(options={}) {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {...(options.headers || {}), ...defaultHeaders});
      this.sse = res;
    });

    server.listen(options.port || defaultPort);
  }

  apply(compiler) {
    compiler.hooks.done.tap(pluginName, stats => {
      if (!this.sse) return;
      this.sse.write(`event: message\ndata: reload\n\n`);
    });
  }
}


module.exports = ReloadPlugin;
