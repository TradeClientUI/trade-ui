const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const Client = require('ftp')
const ProgressBar = require('progress')

const isDir = p => fs.statSync(p).isDirectory()
const shouldExclude = (excludeList, filePath) => excludeList.every(e => {
    if (filePath.includes(path.resolve(__dirname, e))) {
        console.log(chalk.gray(`Ignore directory: ${e}`))
        return true
    }
})

// 遍历文件夹，且通过回调函数处理每个文件（例如文件异步上传操作）
const traverse = (sourcePath, destPath, exclude, callback) => {
    const getServerPath = s => path.normalize(s.replace(sourcePath, destPath))
    const dirs = [sourcePath]
    const files = []
    let p = Promise.resolve()
    let total = 0
    while (dirs.length) {
        const dir = dirs.shift()
        const list = fs.readdirSync(dir)

        /** 排除exclude  */
        if (shouldExclude(exclude, dir)) {
            continue
        }

        list.forEach(e => {
            const filePath = path.resolve(dir, e)
            if (isDir(filePath)) {
                dirs.push(filePath)
            } else {
                files.push(filePath)
                while (files.length) {
                    total += 1
                    const file = files.shift()
                    p = p.then(
                        () => callback(file, getServerPath(file))
                            .then(() => bar.tick({
                                msg: chalk.gray(bar.curr + 1 + '/' + bar.total)
                            }))
                    )
                }
            }
        })
    }
    const bar = new ProgressBar(':bar uploading (:percent) :msg', { total: total, complete: chalk.green('█'), incomplete: '█', width: 36, })
    return p
}

const connectFTP = (options) => {
    return new Promise((resolve, reject) => {
        const c = new Client()
        c.on('ready', function () {
            resolve(c)
        })
        c.connect(options)
    })
}

module.exports = async ({ src, dest, connectOptions, exclude = [] }) => {
    src = path.resolve(__dirname, src)
    dest = path.normalize(dest)
    const { host, port, user, password } = connectOptions
    console.log(`${user}:${password}@${host}:${port}`)
    console.log(('starts to connect...'))
    const c = await connectFTP(connectOptions)
    console.log(chalk.blue('connection is successful', '\n'))
    console.time('upload')
    const timeStart = Date.now()

    const put = (s, d, callback) => {
        c.put(s, d, function (err) {
            if (err) {
                c.mkdir(path.dirname(d), true, error => {
                    if (error) {
                        console.log(error)
                        c.end()
                    } else {
                        c.put(s, d, () => {
                            if (error) {
                                console.log(error)
                            } else {
                                callback()
                            }
                        })
                    }
                })
            } else {
                callback()
            }
        })
    }

    traverse(src, dest, exclude, (s, d) => {
        return new Promise((resolve) => {
            put(s, d, resolve)
        })
    })
        .then(() => {
            console.log(chalk.green('upload success!'), '\n')
            console.log('time: ', (Date.now() - timeStart) / 1000 + 's')
        })
        .catch(error => {
            console.log(chalk.red('upload fial!'))
            console.log(error)
        })
        .finally(() => {
            c.end()
        })
}
