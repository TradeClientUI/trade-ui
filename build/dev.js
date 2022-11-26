const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const child_process = require('child_process')
const { uat, pre } = require('./h5_environment.js')

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
            choices: ['h5', 'wp-editor'],
            default: 'h5',
        },
        {
            type: 'list',
            name: 'theme',
            message: '请选择构建主题',
            choices: themes,
            default: 'false',
        },
        {
            type: 'list',
            name: 'h5Environment',
            message: '请选择调试环境：',
            choices: ['uat', 'pre'], //, 'other'
            when: answers => answers.buildType === 'h5',
            default: 'uat',
        },
        {
            type: 'list',
            name: 'h5URL',
            message: '请选择WP地址：',
            when: answers => answers.buildType === 'h5' && answers.h5Environment !== 'other',
            choices: answers => answers.h5Environment === 'uat' ? uat : pre,
            default: '',
        },
        {
            type: 'input',
            name: 'h5URL_input',
            message: '请输入WP H5地址：',
            when: answers => answers.h5Environment === 'other',
            default: 'http://prewph5_9.cmfbl.com',
        },
    ]
    inquirer.prompt(questions)
        .then((answers) => {
            console.log(answers)
            if (answers.h5URL_input) answers.h5URL = answers.h5URL_input
            Object.assign(process.env, answers)
            const command = answers.buildType === 'h5' ? 'npm run dev_h5' : 'npm run dev_admin'
            child_process.execSync(command, { stdio: [0, 1, 2] })
        })
}
init()
