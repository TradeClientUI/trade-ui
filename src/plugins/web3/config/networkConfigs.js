import { CustomMarket, marketsData } from './marketsConfig'

export default {
    '1': {
        'name': 'Ethereum',
        'publicJsonRPCUrl': [
            'https://cloudflare-eth.com',
            'https://rpc.flashbots.net/'
        ],
        'publicJsonRPCWSUrl': 'wss://eth-mainnet.alchemyapi.io/v2/demo',
        'baseUniswapAdapter': '0xc3efa200a60883a96ffe3d5b492b121d6e9a1f3f',
        'lendingPool': '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
        'WETHGateway': '0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04',
        'baseAssetSymbol': 'ETH',
        'wrappedBaseAssetSymbol': 'WETH',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://etherscan.io',
        'ratesHistoryApiUrl': 'https://aave-api-v2.aave.com/data/rates-history',
        'networkLogoPath': '/icons/networks/ethereum.svg',
        'infuraName': 'mainnet'
    },
    '3': {
        'name': 'Ropsten Testnet',
        'publicJsonRPCUrl': [
            'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
        ],
        'publicJsonRPCWSUrl': '',
        'baseUniswapAdapter': '0x0',
        'baseAssetSymbol': 'ETH',
        'wrappedBaseAssetSymbol': 'WETH',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://ropsten.etherscan.io',
        'isTestnet': true,
        'networkLogoPath': '/icons/networks/ethereum.svg',
        'infuraName': 'ropsten'
    },
    '4': {
        'name': 'Rinkeby',
        'publicJsonRPCUrl': [
            'https://rinkeby-light.eth.linkpool.io/'
        ],
        'baseUniswapAdapter': '',
        'baseAssetSymbol': 'ETH',
        'wrappedBaseAssetSymbol': 'WETH',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://rinkeby.etherscan.io/',
        'isTestnet': true,
        'networkLogoPath': '/icons/networks/ethereum.svg',
        'infuraName': 'rinkeby'
    },
    '10': {
        'name': 'Optimism',
        'publicJsonRPCUrl': [
            'https://mainnet.optimism.io'
        ],
        'publicJsonRPCWSUrl': 'wss://ws-mainnet.optimism.io',
        'baseUniswapAdapter': '0x0',
        'baseAssetSymbol': 'ETH',
        'wrappedBaseAssetSymbol': 'WETH',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://optimistic.etherscan.io',
        'networkLogoPath': '/icons/networks/optimism.svg',
        'bridge': {
            'icon': '/icons/bridge/optimism.svg',
            'name': 'Optimism Bridge',
            'url': 'https://app.optimism.io/bridge'
        }
    },
    '42': {
        'name': 'Kovan',
        'publicJsonRPCUrl': [
            'https://eth-kovan.alchemyapi.io/v2/demo',
            'https://kovan.poa.network'
        ],
        'baseUniswapAdapter': '0xf86Be05f535EC2d217E4c6116B3fa147ee5C05A1',
        'lendingPool': '0xe0fba4fc209b4948668006b2be61711b7f465bae',
        'WETHGateway': '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70',
        'baseAssetSymbol': 'ETH',
        'wrappedBaseAssetSymbol': 'WETH',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://kovan.etherscan.io',
        'isTestnet': true,
        'networkLogoPath': '/icons/networks/ethereum.svg',
        'infuraName': 'kovan'
    },
    '69': {
        'name': 'Optimism Testnet',
        'publicJsonRPCUrl': [
            'https://kovan.optimism.io'
        ],
        'publicJsonRPCWSUrl': 'wss://ws-kovan.optimism.io',
        'baseUniswapAdapter': '0x0',
        'baseAssetSymbol': 'ETH',
        'wrappedBaseAssetSymbol': 'WETH',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://kovan-optimistic.etherscan.io',
        'isTestnet': true,
        'networkLogoPath': '/icons/networks/optimism.svg',
        'bridge': {
            'icon': '/icons/bridge/optimism.svg',
            'name': 'Optimism Bridge',
            'url': 'https://app.optimism.io/bridge'
        }
    },
    '137': {
        'name': 'Polygon POS',
        'publicJsonRPCUrl': [
            'https://polygon-rpc.com'
        ],
        'publicJsonRPCWSUrl': 'wss://polygon-rpc.com',
        'baseAssetSymbol': 'MATIC',
        'wrappedBaseAssetSymbol': 'WMATIC',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://polygonscan.com',
        'networkLogoPath': '/icons/networks/polygon.svg',
        'bridge': {
            'icon': '/icons/bridge/polygon.svg',
            'name': 'Polygon PoS Bridge',
            'url': 'https://wallet.matic.network/bridge/'
        },
        'ratesHistoryApiUrl': 'https://aave-api-v2.aave.com/data/rates-history',
        'infuraName': 'polygon'
    },
    '250': {
        'name': 'Fantom',
        'publicJsonRPCUrl': [
            'https://rpc.ftm.tools'
        ],
        'publicJsonRPCWSUrl': 'wss://wsapi.fantom.network',
        'baseUniswapAdapter': '0x0',
        'baseAssetSymbol': 'FTM',
        'wrappedBaseAssetSymbol': 'WFTM',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://ftmscan.com',
        'networkLogoPath': '/icons/networks/fantom.svg',
        'bridge': {
            'icon': '/icons/bridge/fantom.svg',
            'name': 'Fantom Bridge',
            'url': 'https://app.multichain.org/#/router'
        }
    },
    '4002': {
        'name': 'Fantom Testnet',
        'publicJsonRPCUrl': [
            'https://rpc.testnet.fantom.network'
        ],
        'publicJsonRPCWSUrl': '',
        'baseUniswapAdapter': '0x0',
        'baseAssetSymbol': 'FTM',
        'wrappedBaseAssetSymbol': 'WFTM',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://testnet.ftmscan.com',
        'isTestnet': true,
        'networkLogoPath': '/icons/networks/fantom.svg',
        'bridge': {
            'icon': '/icons/bridge/fantom.svg',
            'name': 'Fantom Bridge',
            'url': 'https://app.multichain.org/#/router'
        }
    },
    '42161': {
        'name': 'Arbitrum',
        'publicJsonRPCUrl': [
            'https://arb1.arbitrum.io/rpc'
        ],
        'publicJsonRPCWSUrl': 'wss://arb1.arbitrum.io/rpc',
        'baseUniswapAdapter': '0x0',
        'baseAssetSymbol': 'ETH',
        'wrappedBaseAssetSymbol': 'WETH',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://arbiscan.io',
        'networkLogoPath': '/icons/networks/arbitrum.svg',
        'bridge': {
            'icon': '/icons/bridge/arbitrum.svg',
            'name': 'Arbitrum Bridge',
            'url': 'https://bridge.arbitrum.io'
        }
    },
    '43113': {
        'name': 'Fuji',
        'publicJsonRPCUrl': [
            'https://api.avax-test.network/ext/bc/C/rpc'
        ],
        'publicJsonRPCWSUrl': 'wss://api.avax-test.network/ext/bc/C/rpc',
        'baseUniswapAdapter': '0x0',
        'baseAssetSymbol': 'AVAX',
        'wrappedBaseAssetSymbol': 'WAVAX',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://cchain.explorer.avax-test.network',
        'isTestnet': true,
        'networkLogoPath': '/icons/networks/avalanche.svg',
        'bridge': {
            'icon': '/icons/bridge/avalanche.svg',
            'name': 'Avalanche Bridge',
            'url': 'https://bridge.avax.network/'
        }
    },
    '43114': {
        'name': 'Avalanche',
        'publicJsonRPCUrl': [
            'https://api.avax.network/ext/bc/C/rpc'
        ],
        'publicJsonRPCWSUrl': 'wss://api.avax.network/ext/bc/C/rpc',
        'baseUniswapAdapter': '0x0',
        'baseAssetSymbol': 'AVAX',
        'wrappedBaseAssetSymbol': 'WAVAX',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://cchain.explorer.avax.network',
        'networkLogoPath': '/icons/networks/avalanche.svg',
        'bridge': {
            'icon': '/icons/bridge/avalanche.svg',
            'name': 'Avalanche Bridge',
            'url': 'https://bridge.avax.network/'
        },
        'ratesHistoryApiUrl': 'https://aave-api-v2.aave.com/data/rates-history'
    },
    '80001': {
        'name': 'Mumbai',
        'publicJsonRPCUrl': [
            'https://polygon-mumbai.g.alchemy.com/v2/demo'
        ],
        'publicJsonRPCWSUrl': 'wss://polygon-mumbai.g.alchemy.com/v2/demo',
        'baseAssetSymbol': 'MATIC',
        'wrappedBaseAssetSymbol': 'WMATIC',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://explorer-mumbai.maticvigil.com',
        'isTestnet': true,
        'networkLogoPath': '/icons/networks/polygon.svg'
    },
    '421611': {
        'name': 'Arbitrum Rinkeby',
        'publicJsonRPCUrl': [
            'https://rinkeby.arbitrum.io/rpc'
        ],
        'publicJsonRPCWSUrl': 'wss://rinkeby.arbitrum.io/rpc',
        'baseUniswapAdapter': '0x0',
        'baseAssetSymbol': 'ETH',
        'wrappedBaseAssetSymbol': 'WETH',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://testnet.arbiscan.io',
        'isTestnet': true,
        'networkLogoPath': '/icons/networks/arbitrum.svg',
        'bridge': {
            'icon': '/icons/bridge/arbitrum.svg',
            'name': 'Arbitrum Bridge',
            'url': 'https://bridge.arbitrum.io'
        }
    },
    '1666600000': {
        'name': 'Harmony',
        'publicJsonRPCUrl': [
            'https://api.s0.t.hmny.io',
            'https://api.harmony.one'
        ],
        'publicJsonRPCWSUrl': 'wss://ws.s0.t.hmny.io',
        'baseUniswapAdapter': '0x0',
        'baseAssetSymbol': 'ONE',
        'wrappedBaseAssetSymbol': 'WONE',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://explorer.harmony.one',
        'networkLogoPath': '/icons/networks/harmony.svg',
        'bridge': {
            'icon': '/icons/bridge/harmony.svg',
            'name': 'Harmony Bridge',
            'url': 'https://bridge.harmony.one'
        }
    },
    '1666700000': {
        'name': 'Harmony Testnet',
        'publicJsonRPCUrl': [
            'https://api.s0.b.hmny.io',
            'https://api.s0.pops.one'
        ],
        'publicJsonRPCWSUrl': 'wss://ws.s0.pops.one',
        'baseUniswapAdapter': '0x0',
        'baseAssetSymbol': 'ONE',
        'wrappedBaseAssetSymbol': 'WONE',
        'baseAssetDecimals': 18,
        'explorerLink': 'https://explorer.pops.one',
        'isTestnet': true,
        'networkLogoPath': '/icons/networks/harmony.svg',
        'bridge': {
            'icon': '/icons/bridge/harmony.svg',
            'name': 'Harmony Bridge',
            'url': 'https://bridge.harmony.one'
        }
    }
}
