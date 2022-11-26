const fs = require('fs')
const path = require('path')
const ftp = require('./ftp')

const md = fs.readFileSync(path.resolve(__dirname, './PCUI配置.md'), 'utf8')
const html = fs.readFileSync(path.resolve(__dirname, '../build_folder/dist/index_template.html'), 'utf8')
const newHtml = html.replace(/\/\*\s##wp_imsService\sstart##\s\*\/[\s\S]*wp_tradeService end##\s\*\//, md)
fs.writeFileSync(path.resolve(__dirname, '../build_folder/dist/index.html'), newHtml)

ftp({
    src: '../build_folder/dist', // 资源路径
    dest: '/web2', // 服务端路径
    exclude: ['../build_folder/dist/charting_library'], // 不上传
    connectOptions: {
        host: '**',
        port: 21,
        user: '**',
        password: '**'
    }
})
