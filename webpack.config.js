const defaultConfig = require('@wordpress/scripts/config/webpack.config.js');
const path = require('path');
module.exports = {
    ...defaultConfig,
    ...{
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src/'),
                'assets': path.resolve(__dirname, 'assets/')
            },
        }
    },
    entry: {
        ...defaultConfig.entry(),
        "template-library/post-editor-template-library": ['./src/template-library/post-editor-template-library.js'],
        "template-library/site-editor-template-library": ['./src/template-library/site-editor-template-library.js'],
    },
}
