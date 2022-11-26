export default function () {
    const h5Preview = Boolean(process.env.VUE_APP_h5Preview)
    return {
        h5Preview
    }
}
