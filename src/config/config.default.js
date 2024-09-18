module.exports = {
  default: {
    logger: {
      handler: 'console',
      options: {
        url: 'https://api.mywebsite.com/api/v1/clientlogs',
        method: 'POST',
        formatter: 'json',
      },
    },
    plugins: {
      reload: {
        port: 8082,
      }
    }
  },
}
