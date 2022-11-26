const modulesFiles = require.context('./', true, /.js$/)

export default PineJS => Promise.resolve(modulesFiles.keys().filter(key => !key.includes('index')).map((modules, modulePath) =>{
    return modulesFiles(modules).default(PineJS)
}))

