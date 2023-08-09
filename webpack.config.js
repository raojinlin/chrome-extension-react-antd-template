const path = require('path');
const slash = require('slash');
const CopyPlugin = require("copy-webpack-plugin");

const env = process.env.ENV || 'production';
const isDev = env === 'development';
const classNamePrefix = 'web-extension';


const config = {
    mode: env,
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
                            '@babel/plugin-proposal-object-rest-spread',
                            '@babel/plugin-proposal-class-properties',
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
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: isDev,
                            getLocalIdent: (context, localIdentName, localName, options) => {
                                if (context.resourcePath.includes('node_modules') || context.resourcePath.includes('global.less')) {
                                    return localName;
                                }

                                const match = context.resourcePath.match(/src(.*)/);
                                if (match && match[1]) {
                                    const antdProPath = match[1].replace('.less', '').replace('.css', '');
                                    const arr = slash(antdProPath)
                                        .split('/')
                                        .map(a => a.replace(/([A-Z])/g, '-$1'))
                                        .map(a => a.toLowerCase());
                                    return `${classNamePrefix}-${arr.join('-')}-${localName}`.replace(/--/g, '-');
                                }

                                return localName;
                            },
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            modules: true,
                            sourceMap: isDev,
                            javascriptEnabled: true,
                            modifyVars: {
                                'primary-color': '#fb9332',
                                'link-color': '#fb9332',
                            },
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
        new CopyPlugin({
            patterns: [
                {from: path.join(__dirname, `./src/manifest.${env}.json`), to: path.join(__dirname, './extension/manifest.json')}
            ]
        })
    ]
};

module.exports = config;

