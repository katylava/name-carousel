module.exports = function override(config, env) {
  // Add babel-plugin-istanbul for code coverage during development
  if (env === 'development') {
    // Find the babel-loader rule
    const babelLoaderRule = config.module.rules
      .find(rule => rule.oneOf)
      ?.oneOf?.find(
        rule =>
          rule.test && rule.test.toString().includes('\\.(js|mjs|jsx|ts|tsx)$')
      );

    if (
      babelLoaderRule &&
      babelLoaderRule.options &&
      babelLoaderRule.options.plugins
    ) {
      // Add istanbul plugin for coverage instrumentation
      babelLoaderRule.options.plugins.push([
        'babel-plugin-istanbul',
        {
          exclude: [
            '**/*.test.js',
            '**/*.spec.js',
            '**/node_modules/**',
            '**/tests/**',
            '**/coverage/**',
          ],
        },
      ]);
    }
  }

  return config;
};
