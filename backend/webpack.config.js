const webpack = require('webpack');

/**
 * @param {import('webpack').Configuration} config 
 */
module.exports = config => {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
      new webpack.IgnorePlugin({resourceRegExp: /^cloudflare:sockets$/}),
    ]
  }
}
