const webpack = require('webpack');
const path = require('path');
const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
	entry: {
		"vs": "./vs.js",
		"vs.tg": "./vs.target.js",
		"vs.only": "./vs.only.js",
		"vs.b": "./vs.bottom.js"
	},
	output: {
		path: path.resolve(__dirname, 'd'),
		filename: '[name].js'
	},
	devtool: "source-map",
	target: 'web',
	plugins: [
		new BabiliPlugin()
	]
};
