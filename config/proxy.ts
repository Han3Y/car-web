/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api': {
      // target: 'http://127.0.0.1:8075',
      target: 'http://106.12.160.144:80',
      changeOrigin: true,
      secure: false,
      // pathRewrite: { '^/api': '' },
    },
    '/nologin': {
      // target: 'http://127.0.0.1:8075',
      target: 'http://110.40.193.169:80',
      secure: false,
      timeout: 600000,
    },
    '/sys': {
      // target: 'http://127.0.0.1:8075',
      target: 'http://110.40.193.169:80',
      secure: false,
      timeout: 600000,
    },
    '/wsstone': {
      ws: true,
      secure: false,
      changeOrigin: true,
      target: 'http://127.0.0.1:8075',
      timeout: 600000,
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
