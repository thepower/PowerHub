const webpack = require('webpack');
module.exports = function override(config, env) {
  config.resolve.fallback = {
    "buffer": require.resolve('buffer'),
    "crypto": require.resolve('crypto-browserify'),
    "stream": require.resolve('stream-browserify'),
    "util": require.resolve('util'),
    "fs": false,
    "path": false
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  );

  config.experiments = {
      topLevelAwait: true,
  };

  config.optimization.minimizer[0].options.minimizer.options.mangle = {
    reserved: ['Buffer', 'BigInteger', 'Point', 'ECPubKey', 'ECKey', 'sha512_asm', 'asm', 'ECPair', 'HDNode', 'safari10'],
  };

  return config;
}
