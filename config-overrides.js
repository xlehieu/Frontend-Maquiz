const { override, useBabelRc } = require('customize-cra');

module.exports = override(useBabelRc(), (config, env) => {
    if (env === 'production') {
        config.devtool = false; // Tắt source map
    }
    return config;
});
