const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const WebpackBar = require('webpackbar');

const env = process.env.ENV || 'production';
const isDev = env === 'development';


const config = {
    mode: env,
    devtool: isDev ? 'source-map' : false,
    entry: {
        'js/background': path.resolve(__dirname, './src/background.js'),
        'js/popup': path.resolve(__dirname, './src/popup.js'),
        'js/options': path.resolve(__dirname, './src/options.js'),
        'js/content-script': path.resolve(__dirname, './src/content-script.js'),
    },
    output: {
        path: path.resolve(__dirname, 'extension/'),
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'js/vendors',
                    chunks: chunk => chunk.name !== 'js/background',
                },
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        sourceMap: isDev,
                        presets: [['@babel/preset-env', {
                            useBuiltIns: 'usage',
                            corejs: {version: '3.9'}
                        }], '@babel/react'],
                        plugins: [
                            [
                                "@babel/plugin-proposal-decorators",
                                {"decoratorsBeforeExport": true}
                            ],
                            '@babel/plugin-transform-object-rest-spread',
                            '@babel/plugin-transform-class-properties',
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-transform-regenerator',
                            "@babel/plugin-transform-computed-properties",
                            ["import", {"libraryName": "antd", style: true}]
                        ],
                    }
                }
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
            {
                test: /\.(less)$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'styleTag'
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDev,
                            modules: {
                                localIdentName: isDev ? "[path][name]_[local]-[hash:base64:5]" : '[local].[hash:base64:5]',
                            }, 
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                sourceMap: isDev,
                                modules: true,
                            }
                        },
                    }
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'images/dist'
                    }
                },
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\/version$/,
                use: [
                    {
                        loader: 'raw-loader',
                        options: {
                            esModule: false,
                        },
                    },
                ],
            },
        ]
    },
    devServer: {
        index: "index.html",
        port: 8089,
        contentBase: path.join(__dirname, 'extension/'),
        liveReload: true,
        progress: true,
        inline: true,
        hot: true,
        proxy: {}
    },
    plugins: [
        new WebpackBar(),
        new CopyPlugin({
            patterns: [
                {from: path.join(__dirname, `./src/manifest.${env}.json`), to: path.join(__dirname, './extension/manifest.json')}
            ]
        }),
    ]
};

module.exports = config;