const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const child_process = require('child_process')
const dayjs = require('dayjs')

function resolvePath (_path) {
    return path.join(__dirname, _path)
}

function queryThemes (params) {
    return new Promise(resolve => {
        fs.readdir(resolvePath('../src/themes'), { withFileTypes: true }, (err, files) => {
            const directory = []
            for (const file of files) {
                if (file.isDirectory() && file.name !== 'upgrading') {
                    directory.push(file.name)
                }
            }
            resolve(directory)
        })
    })
}

async function init () {
    const themes = await queryThemes()
    const questions = [
        {
            type: 'list',
            name: 'buildType',
            message: '构建单个WP插件还是构建所有的WP插件',
            choices: ['cats-upload-all', 'cats-upload', 'cats-upload-admin'],
            default: 'cats-upload-all',
        },
        {
            type: 'list',
            name: 'theme',
            message: '请选择构建主题',
            choices: themes,
            // when: (answers) => answers.buildType !== 'cats-upload-admin',
            default: 'false',
        },
        {
            type: 'list',
            name: 'sourceMap',
            message: '请选择是否生成sourceMap',
            choices: ['false', 'true'],
            default: 'false',
        },
    ]
    inquirer.prompt(questions)
        .then((answers) => {
            Object.assign(process.env, answers)
            const command = answers.buildType === 'cats-upload-admin' ? 'npm run build_admin' : 'npm run build'
            child_process.execSync(command, { stdio: [0, 1, 2] })
            answers.time = dayjs().format('YYYY-MM-DD HH:mm')
            console.log(answers)
        })
}
init()
