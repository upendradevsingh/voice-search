const webpack = require('webpack');
const path = require('path');
const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
	entry: "./vs.js",
	output: {
		path: path.resolve(__dirname, 'd'),
		filename: 'vs.js'
		// library: 'Recoginition'
	},
	// module: {
	// 	rules: [
	// 		{
	// 			test: /\.js?$/,
	// 			include: [
	// 	          path.resolve(__dirname)
	// 	        ],
	// 	        exclude: [
	// 	          path.resolve(__dirname, "dist")
	// 	        ],
			
	// 			loader: "babel-loader",
	// 	        // the loader which should be applied, it'll be resolved relative to the context
	// 	        // -loader suffix is no longer optional in webpack2 for clarity reasons
	// 	        // see webpack 1 upgrade guide

	// 	        options: {
	// 	          presets: ["es2017"]
	// 	        }
	//     	}
	// 	]
	// },
	devtool: "source-map",
	target: 'web',
	plugins: [
		// new webpack.optimize.UglifyJsPlugin({
  //   			compress: {
  //     			warnings: false,
  //     			drop_console: false,
  //   		}
  // 		})
		new BabiliPlugin()
	]
};
