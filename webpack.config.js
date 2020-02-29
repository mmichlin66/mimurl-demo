const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');



let isProd = process.argv.indexOf('-p') !== -1;
let mode = isProd ? "production" : "development";
let devtool = isProd ? "source-map" : "#inline-source-map";
let outputFilename = isProd ? "mimurl-demo.js" : "mimurl-demo.dev.js";
let cssFilename = isProd ? "mimurl-demo.css" : "mimurl-demo.dev.css";

let optimization = undefined;
if (isProd)
	optimization = 	{ minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})] };

// define preprocessor variables for ifdef-loader
const ifdefLoaderOptions =
{
    DEBUG: !isProd,

    //"ifdef-verbose": true,       // add this for verbose output
    //"ifdef-triple-slash": false  // add this to use double slash comment instead of default triple slash
};



module.exports =
{
    entry: "./src/main.tsx",

    output:
    {
        filename: outputFilename,
        path: __dirname + "/lib",
		// library: "mimurl-demo",
		libraryTarget: 'umd',
		globalObject: 'this'
    },

    mode: mode,
    //mode: "production",
    //mode: "none",

    // Enable sourcemaps for debugging webpack's output.
    devtool: devtool,
    //devtool: "source-map",

    resolve:
    {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", ".css"]
    },

    module:
    {
        rules:
        [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            //{ test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            {
                test: /\.tsx?$/,
                use:
                [
                    //{ loader: "awesome-typescript-loader" },
                    { loader: "ts-loader" },
                    { loader: "ifdef-loader", options: ifdefLoaderOptions }
                ],
				exclude: /node_modules|\.d\.ts$/
            },

			{
				test: /\.d\.ts$/,
				loader: 'ignore-loader'
			},

			{
				test: /\.css$/,
				use: [ MiniCssExtractPlugin.loader, "css-loader"]
			},

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

	optimization: optimization,

	plugins:
	[
		new MiniCssExtractPlugin({ filename: cssFilename })
	],

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals:
    {
        mimurl: { root: 'mimurl', commonjs2: 'mimurl', commonjs: 'mimurl', amd: 'mimurl' },
        mimbl: { root: 'mimbl', commonjs2: 'mimbl', commonjs: 'mimbl', amd: 'mimbl' },
        mimcl: { root: 'mimcl', commonjs2: 'mimcl', commonjs: 'mimcl', amd: 'mimcl' },
        mimcss: { root: 'mimcss', commonjs2: 'mimcss', commonjs: 'mimcss', amd: 'mimcss' },
    }
};