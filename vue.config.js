const path = require('path')
const dayjs = require('dayjs')
const { queryBuildConfig } = require('./build/buildConfig.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
var plugins = []
const pages = {}
function resolve (dir) {
    return path.join(__dirname, dir)
}
process.env.VUE_APP_build = dayjs().format('YYYY-MM-DD HH:mm')
const NODE_ENV = process.env.NODE_ENV
const isAdminMode = process.env.VUE_APP_isAdmin === 'true' // WordPress后台插件的开发模式
console.log(NODE_ENV, isAdminMode ? 'wp编辑器' : 'C端')
// console.log(process.env)
const { buildType = 'cats-upload-all', theme = 'plans', h5URL, sourceMap } = queryBuildConfig()
console.log(buildType, theme)
process.env.VUE_APP_theme = theme
const alias = {
    'vue$': 'vue/dist/vue.esm-bundler.js',
    '@public': resolve('public'),
    '@': resolve('src'),
    '@api': resolve('src/api'),
    '@m': resolve('src/themes/mt4'),
    '@c': resolve('src/themes/cats'),
    '@ct': resolve('src/themes/ctrader'),
    '@abcc': resolve('src/themes/abcc'),
    '@plans': resolve('src/themes/plans'),
    '@planspc': resolve('src/themes/plans_PCUI'),
    '@admin': resolve('src_admin'),
    '@utils': resolve('src_admin/utils'),
    '@index': resolve('src_admin/pages/index'),
    '@h5': resolve(`src/themes/${theme}`),
    '@w': resolve('src/themes/webview'),
}

if (process.env.NODE_ENV === 'production') {
    const pluginName = isAdminMode ? 'editor' : 'h5'
    const packageName = isAdminMode ? 'cats-upload-admin' : 'cats-upload-h5' // zip包名字
    const outputDirDestination = `/build_folder/${packageName}/${packageName}/dist/skin_${theme}_2`
    const wp_init_file = isAdminMode ? 'init_editor.ini' : 'init_h5.ini'
    plugins.push(
        new FileManagerPlugin({
            events: {
                onEnd: {
                    // delete: [
                    //     `./build_folder/${pathStr}/${pathStr}/dist`,
                    //     `./build_folder/${pathStr}.zip`
                    // ],
                    copy: [{
                        source: resolve('/build_folder/dist'),
                        destination: resolve(outputDirDestination) + `/${pluginName}`
                    }, {
                        source: resolve(`/src/themes/${theme}/${wp_init_file}`),
                        destination: resolve(outputDirDestination) + `/${wp_init_file}`
                    }],
                    archive: [
                        // { source: resolve(`${pathName}`), destination: resolve(`zip/${pathName}${dayjs().format('YYYYMMDDHHmm')}.zip`) },
                        {
                            source: resolve(`./build_folder/${packageName}`),
                            destination: `./build_folder/${packageName}.zip`,
                            options: {
                                gzipOptions: {
                                    level: 1
                                }
                            }
                        }
                    ],

                }
            }
        })
    )
    // 编译前清空旧的编译文件
    plugins.push(new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [resolve(`${outputDirDestination}/**`)],
    }))
}

if (isAdminMode) {
    // WordPress后台插件的开发模式
    Object.assign(pages, {
        index: {
            entry: 'src_admin/pages/index/main.js',
            template: 'public/admin.html',
            filename: 'index.html',
        },
        // preview: {
        //     entry: 'src_admin/pages/preview/main.js',
        //     template: 'public/preview.html',
        //     filename: 'preview.html',
        // }
    })
} else {
    // H5开发模式
    Object.assign(pages, {
        index: {
            entry: `src/themes/${theme}/main.js`,
            template: 'public/index.html',
            minify: {
                collapseWhitespace: true,
                keepClosingSlash: true,
                removeComments: false,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            },
            filename: process.env.NODE_ENV === 'production' ? 'index_template.html' : 'index.html',
        },
        upgrading: {
            entry: 'src/themes/upgrading/main.js',
            template: 'public/index.html',
            minify: {
                collapseWhitespace: true,
                keepClosingSlash: true,
                removeComments: false,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            },
            filename: process.env.NODE_ENV === 'production' ? 'upgrading.html' : 'upgrading.html',
        }
        // index: 'src/themes/mt4/main.js'
        // index: 'src/themes/ctrader/main.js'
    })
}

const config = {
    productionSourceMap: sourceMap === 'true',
    publicPath: process.env.NODE_ENV === 'production' && isAdminMode ? `/wp-content/plugins/cats-manage/skin/skin_${theme}_2/editor/` : '/', // static/
    // indexPath: isAdminMode ? 'index.html' : 'index_template.html', // 就是这条
    lintOnSave: false,
    outputDir: isAdminMode ? './build_folder/dist' : './build_folder/dist',
    configureWebpack: {
        plugins,
        optimization: {
            splitChunks: {
                cacheGroups: {
                    default: false
                }
            }
        },
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        resolve: {
            alias
        }
    },
    css: {
        loaderOptions: { // 自动注入全局变量样式
            sass: {
                // 注意: 在 sass-loader v8 中，这个选项是 prependData
                prependData: '@import "~@/sass/mixin.scss";',
            },
        },
    },
    devServer: {
        port: isAdminMode ? 8080 : 8090,
        open: false,
        host: '0.0.0.0',
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/wp-content/uploads': {
                target: h5URL || 'https://prewpadmin_10.cmfbl.com',
            },
            '/api/geoip': {
                target: h5URL || 'https://prewpadmin_10.cmfbl.com',
            },
            '/api/': {
                target: h5URL || 'https://prewpadmin_10.cmfbl.com',
                onProxyReq: function (proxyReq, req, res, options) { // 由于vue中使用了body-parser 导致http中的body被序列化两次，从而使得配置代理后后端无法获取body中的数据
                    if (req.body) {
                        const reg = new RegExp('application/json')
                        if (reg.test(proxyReq.getHeader('Content-Type'))) {
                            const bodyData = JSON.stringify(req.body)
                            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
                            proxyReq.write(bodyData)
                        }
                    }
                }
            },
            '/wp-json/wp': {
                target: 'https://prewpadmin_10.cmfbl.com', // http://prewpadmin.cats-trade.com/
                // changeOrigin: false,
                disableHostCheck: true,
                onProxyReq: function (proxyReq, req, res, options) { // 由于vue中使用了body-parser 导致http中的body被序列化两次，从而使得配置代理后后端无法获取body中的数据
                    if (req.body) {
                        const reg = new RegExp('application/json')
                        if (reg.test(proxyReq.getHeader('Content-Type'))) {
                            const bodyData = JSON.stringify(req.body)
                            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
                            // stream the content
                            proxyReq.write(bodyData)
                        }
                    }
                }
            },
            '/cats-manage-api': {
                target: h5URL || 'https://prewpadmin_10.cmfbl.com', // prewph5公司id为2 prewph5_1公司id为60  'http://prewph5_9.cats-trade.com'  // h5URL
                disableHostCheck: true,
                onProxyReq: function (proxyReq, req, res, options) { // 由于vue中使用了body-parser 导致http中的body被序列化两次，从而使得配置代理后后端无法获取body中的数据
                    if (req.body) {
                        const reg = new RegExp('application/json')
                        if (reg.test(proxyReq.getHeader('Content-Type'))) {
                            const bodyData = JSON.stringify(req.body)
                            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
                            // stream the content
                            proxyReq.write(bodyData)
                        }
                    }
                }
            },
            '/upload': {
                target: 'https://prewpadmin_10.cmfbl.com/cats-gateway/upload'
            },
            '/infura/': {
                target: 'https://uatwph5-5.cmfbl.com',
                onProxyReq: function (proxyReq, req, res, options) { // 由于vue中使用了body-parser 导致http中的body被序列化两次，从而使得配置代理后后端无法获取body中的数据
                    if (req.body) {
                        const reg = new RegExp('application/json')
                        if (reg.test(proxyReq.getHeader('Content-Type'))) {
                            const bodyData = JSON.stringify(req.body)
                            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
                            // stream the content
                            proxyReq.write(bodyData)
                        }
                    }
                }
            }
        },
        before: require('./mock/mock-server.js')
    },
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('preload-index')

        config.plugin('prefetch-index').tap(options => {
            options[0].fileWhitelist = options[0].fileWhitelist || []
            options[0].fileWhitelist.push(/Home(.)+?\.js$/)
            options[0].fileWhitelist.push(/Order(.)+?\.js$/)
            options[0].fileWhitelist.push(/Quote(.)+?\.js$/)
            options[0].fileWhitelist.push(/Assets(.)+?\.js$/)
            return options
        })
        config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js')
    },
    pages
}

// uniapp图表详情页面插件打包功能
const argv = require('minimist')(process.argv.slice(2))
if (argv && argv.type === 'webview') {
    Object.assign(config, {
        publicPath: './',
        productionSourceMap: false,
        pages: {
            webview: {
                entry: 'src/themes/webview/main.js',
                template: 'public/webview.html',
                filename: 'webview.html',
            }
        }
    })
}

module.exports = config
