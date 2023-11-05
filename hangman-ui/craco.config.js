const customWebpackConfigOverride = {
    devServer: (devServerConfig) => {
        devServerConfig.headers = {
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Resource-Policy': 'same-site',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        }
        return devServerConfig;
    },
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            console.log(webpackConfig);
            webpackConfig.experiments = { topLevelAwait: true };
            return webpackConfig;
        }
    }
};

module.exports = customWebpackConfigOverride;