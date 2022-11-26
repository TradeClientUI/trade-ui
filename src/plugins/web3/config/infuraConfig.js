export const infuraId = '687e89f0d8a44f92ae2815a1d2649235'
export const getBaseUrl = (networkName) => {
    if (networkName === 'polygon') {
        return 'https://matic-mainnet.chainstacklabs.com'
    } else if (process.env.NODE_ENV === 'production') {
        return `/infura/${networkName}/v3/`
    } else {
        return `https://${networkName}.infura.io/v3/${infuraId}`
    }
}
