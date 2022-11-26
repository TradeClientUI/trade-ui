const queryBuildConfig = () => {
    const { buildType, theme, h5URL, sourceMap } = process.env
    return {
        buildType,
        h5URL,
        sourceMap,
        theme
    }
}
module.exports = {
    queryBuildConfig
}
