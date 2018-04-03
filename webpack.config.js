const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const pug = require('./webpack/pug');
const devServer = require('./webpack/devServer');
const css = require('./webpack/css');
const extractCSS = require('./webpack/css.extract');
const uglifyJS = require('./webpack/js-uglify');
const media = require('./webpack/media');

const PATHS = {
	source: path.join(__dirname, 'source'),
	build: path.join(__dirname, 'build')
};

const common = merge([
	{
		entry: PATHS.source + '/index.js',
		output: {
			path: PATHS.build,
			filename: 'js/[name].js'
		},
		plugins: [
			new HtmlWebpackPlugin({
				filename: 'index.html',
				template: PATHS.source + '/index.pug'
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: 'common'
			})
		]
	},
	pug(),
	media()
]);


module.exports = function(env) {
	if (env == 'production') {
		return merge([
			common,
			extractCSS(),
			uglifyJS()
		])	
	}
	if (env === 'development') {
		return merge([
			common,
			css(),
			devServer()
		])
	}
};