var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        // Main App.
        "./src/js/main/App.js"
    ],

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "target"),
    },

    module: {
        // Transpiles ECMA6 into ECMA5 with babel, enables importing of ES6 and React modules.
        loaders: [
            {
                loader: "babel",
                test: /\.js$/,
                query: {
                    presets: ["es2015", "react"]
                }
            },
            // Enables importing of sass files into the ES6 modules.
            {
                test: /\.sass$/,
                loaders: ["style", "css", "sass"]
            },
            // Enables importing of css files into the ES6 modules.
            {
                test: /\.css$/,
                loaders: ["style", "css"]
            },
            // Enables importing of images into the ES6 modules.
            {
                test: /\.(png|ico)$/,
                loader: "file"
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
}
