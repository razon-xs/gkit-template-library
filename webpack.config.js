const defaultConfig = require( '@wordpress/scripts/config/webpack.config.js' );
const path = require( 'path' );
module.exports = {
	...defaultConfig,
	...{
		resolve: {
			alias: {
				'@': path.resolve( __dirname, 'src/' ),
				assets: path.resolve( __dirname, 'assets/' ),
			},
		},
	},
	entry: {
		...defaultConfig.entry(),
		'library/editor-template-library': [
			'./src/template-library/editor-template-library.js',
		],
	},
};
