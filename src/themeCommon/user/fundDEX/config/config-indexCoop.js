import { computed } from 'vue'
import { useStore } from 'vuex'

import bedBorderLogo from '@/assets/fundDex_icon/bed-border.png'
import dataLogo from '@/assets/fundDex_icon/data-logo.png'
import gmiLogo from '@/assets/fundDex_icon/gmilogo.png'
import iethflipLogo from '@/assets/fundDex_icon/iethfliplogo.svg'
import imaticflipLogo from '@/assets/fundDex_icon/imaticflilogo.svg'
import indexLogo from '@/assets/fundDex_icon/index-token.png'
import maticflipLogo from '@/assets/fundDex_icon/maticflilogo.svg'
import indexCoopFav from '@/assets/fundDex_icon/index-logo-black.png'
import { ethereumABI_bed, ethereumABI_btcfli, ethereumABI_data, ethereumABI_dpi, ethereumABI_ethfli, ethereumABI_gmi, ethereumABI_iceth, ethereumABI_index, ethereumABI_jpg, ethereumABI_mvi, polygonABI_data, polygonABI_dpi, polygonABI_ethflip, polygonABI_gmi, polygonABI_ibtcflip, polygonABI_iethflip, polygonABI_index, polygonABI_matic2xflip, polygonABI_maticflip, polygonABI_mvi, commonABI } from '@/plugins/web3/abi/indexCoop_abi'
// import * as tokenAddresses from 'constants/ethContractAddresses'

export const dpiTokenImage = 'https://index-dao.s3.amazonaws.com/defi_pulse_index_set.svg'

export const indexCoopFavLogo = indexCoopFav

export const DefiPulseIndex = {
    name: 'DeFi Pulse Index',
    symbol: 'DPI',
    address: '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b',
    decimals: 18,
    image: dpiTokenImage,
    polygonAddress: '0x85955046DF4668e1DD369D2DE9f3AEB98DD2A369',
    coingeckoId: 'defipulse-index',
    tokensetsId: 'dpi',
    tokenSelector: 'dpi',
    linktype: '',
    fees: {
        streamingFee: '0.95%',
    },
    ethereumABI: ethereumABI_dpi,
    polygonABI: polygonABI_dpi,
    commonABI: commonABI,
    about: 'The DeFi Pulse Index (DPI) is a capitalization-weighted index that tracks the performance of decentralized financial assets across the market.'
}

export const IndexToken = {
    name: 'Index Token',
    symbol: 'INDEX',
    address: '0x0954906da0Bf32d5479e25f46056d22f08464cab',
    decimals: 18,
    // polygonAddress: '0xfBd8A3b908e764dBcD51e27992464B4432A1132b',
    image: indexLogo,
    coingeckoId: 'index-cooperative',
    tokensetsId: 'index',
    tokenSelector: 'index',
    linktype: '',
    fees: undefined,
    ethereumABI: ethereumABI_index,
    polygonABI: polygonABI_index,
    commonABI: commonABI,
    about: '$INDEX: the native token of Index CoopIndex Coop is a decentralized, autonomous organization that issues its own native token, $INDEX. Use your $INDEX to govern Index Coop, by voting for and against internal governance proposals on Snapshot. Or buy and hold $INDEX for its metagovernance power in other DeFi communities. You can earn $INDEX rewards by contributing to the growth and sustainability of Index Coop, or by providing liquidity for Index Coop products on decentralized exchanges. You can also just buy $INDEX on a centralized or decentralized exchange.'
}

export const Ethereum2xFlexibleLeverageIndex = {
    name: 'Ethereum 2x Flexible Leverage Index',
    symbol: 'ETH2x-FLI',
    address: '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
    decimals: 18,
    polygonAddress: undefined,
    image: 'https://set-core.s3.amazonaws.com/img/portfolios/eth2x_fli.svg',
    coingeckoId: 'eth-2x-flexible-leverage-index',
    tokensetsId: 'ethfli',
    tokenSelector: 'ethfli',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
    },
    ethereumABI: ethereumABI_ethfli,
    polygonABI: undefined,
    commonABI: commonABI,
    about: 'The Ethereum Flexible Leverage Index (ETH2x-FLI) lets you leverage a collateralized debt position in a safe and efficient way, by abstracting its management into a simple index. It enabled market participants to take on leverage while minimizing the transaction costs and risks associated with maintaining collateralized debt.'
}

export const Ethereum2xFLIP = {
    name: 'Ethereum 2x FLI Polygon',
    symbol: 'ETH2X-FLI-P',
    address: undefined,
    polygonAddress: '0x3Ad707dA309f3845cd602059901E39C4dcd66473',
    decimals: 18,
    image: 'https://set-core.s3.amazonaws.com/img/portfolios/eth2x_fli.svg',
    coingeckoId: 'index-coop-eth-2x-flexible-leverage-index',
    tokensetsId: 'eth2x-fli-p',
    tokenSelector: 'eth2x-fli-p',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
        mintRedeemFee: '0.1%',
    },
    ethereumABI: undefined,
    polygonABI: polygonABI_ethflip,
    commonABI: commonABI,
    about: 'The Polygon-native version of the Ethereum Flexible Leverage Index (ETH2x-FLI-P) lets you leverage a collateralized debt position in a safe and efficient way, by abstracting its management into a simple index. It enables market participants to take on leverage while minimizing the transaction costs and risks associated with maintaining collateralized debt.'
}

export const MetaverseIndex = {
    name: 'Metaverse Index',
    symbol: 'MVI',
    address: '0x72e364F2ABdC788b7E918bc238B21f109Cd634D7',
    decimals: 18,
    polygonAddress: '0xfe712251173A2cd5F5bE2B46Bb528328EA3565E1',
    image: 'https://set-core.s3.amazonaws.com/img/portfolios/mvi.svg',
    coingeckoId: 'metaverse-index',
    tokensetsId: 'mvi',
    tokenSelector: 'mvi',
    linktype: '',
    fees: {
        streamingFee: '0.95%',
    },
    ethereumABI: ethereumABI_mvi,
    polygonABI: polygonABI_mvi,
    commonABI: commonABI,
    about: 'The Metaverse Index (MVI) is designed to capture the trend of entertainment, sports and business shifting to take place in virtual environments.'
}

export const Bitcoin2xFlexibleLeverageIndex = {
    name: 'Bitcoin 2x Flexible Leverage Index',
    symbol: 'BTC2x-FLI',
    address: '0x0B498ff89709d3838a063f1dFA463091F9801c2b',
    decimals: 18,
    polygonAddress: undefined,
    image: 'https://set-core.s3.amazonaws.com/img/portfolios/fli_btc.svg',
    coingeckoId: 'btc-2x-flexible-leverage-index',
    tokensetsId: 'btcfli',
    tokenSelector: 'btcfli',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
    },
    ethereumABI: ethereumABI_btcfli,
    polygonABI: undefined,
    commonABI: commonABI,
    about: 'The Bitcoin Flexible Leverage Index (BTC2x-FLI) lets you leverage a collateralized debt position in a safe and efficient way, by abstracting its management into a simple index. It enabled market participants to take on leverage while minimizing the transaction costs and risks associated with maintaining collateralized debt.'
}

export const BedIndex = {
    name: 'Bankless BED Index',
    symbol: 'BED',
    address: '0x2aF1dF3AB0ab157e1E2Ad8F88A7D04fbea0c7dc6',
    decimals: 18,
    polygonAddress: undefined,
    image: bedBorderLogo,
    coingeckoId: 'bankless-bed-index',
    tokensetsId: 'bed',
    tokenSelector: 'bed',
    linktype: '',
    fees: {
        streamingFee: '0.25%',
    },
    ethereumABI: ethereumABI_bed,
    polygonABI: undefined,
    commonABI: commonABI,
    about: 'Bankless proposed that the Index Coop manage a Set based on an index of Crypto’s most investable assets, BTC, ETH, and DPI, in equal weight. This construction — known as the BED Index or Bankless BED Index (BED) — seeks to give safe, passive exposure to a vehicle that captures equal-weighted upside from the most promising use cases and themes in crypto: store of value, programmable money, and decentralized finance.'
}

export const DataIndex = {
    name: 'Data Economy Index',
    symbol: 'DATA',
    address: '0x33d63Ba1E57E54779F7dDAeaA7109349344cf5F1',
    decimals: 18,
    // polygonAddress: '0x1D607Faa0A51518a7728580C238d912747e71F7a',
    image: dataLogo,
    coingeckoId: 'data-economy-index',
    tokensetsId: 'data',
    tokenSelector: 'data',
    linktype: '',
    fees: {
        streamingFee: '0.95%',
    },
    ethereumABI: ethereumABI_data,
    polygonABI: polygonABI_data,
    commonABI: commonABI,
    about: 'Web3 enables a new data economy. The Web3 Data Economy Index is an ecosystem of data-centric protocols and applications disrupting the data monopolies built in Big Tech. DATA provides exposure to the growth of the Web3 data economy in a single token.'
}

export const GmiIndex = {
    name: 'Bankless DeFi Innovation Index',
    symbol: 'GMI',
    address: '0x47110d43175f7f2C2425E7d15792acC5817EB44f',
    decimals: 18,
    // polygonAddress: '0x7fb27ee135db455de5ab1ccec66a24cbc82e712d',
    image: gmiLogo,
    coingeckoId: 'bankless-defi-innovation-index',
    tokensetsId: 'gmi',
    tokenSelector: 'gmi',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
    },
    ethereumABI: ethereumABI_gmi,
    polygonABI: polygonABI_gmi,
    commonABI: commonABI,
    about: 'The Bankless DeFi Innovation Index (GMI) is a simple composite index including promising early stage DeFi projects. The Bankless DeFi Innovation Index is a simple composite index launched by the Index Cooperative. The index focuses on high growth, early stage DeFi projects which are not yet considered “blue chip”. GMI produces an optimal weighting via the use of a combination of square-root market cap, relative secondary market liquidity, and relative token dilution/emission scoring.'
}

export const Matic2xFLIP = {
    name: 'MATIC 2x Flexible Leverage Index',
    symbol: 'MATIC2x-FLI-P',
    address: undefined,
    polygonAddress: '0xf287D97B6345bad3D88856b26Fb7c0ab3F2C7976',
    decimals: 18,
    image: maticflipLogo,
    coingeckoId: 'index-coop-matic-2x-flexible-leverage-index',
    tokensetsId: 'matic2x-fli-p',
    tokenSelector: 'matic2x-fli-p',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
        mintRedeemFee: '0.1%',
    },
    ethereumABI: undefined,
    polygonABI: polygonABI_matic2xflip,
    commonABI: commonABI,
    about: 'The MATIC 2x Flexible Leverage Index on Polygon (MATIC2x-FLI-P) lets you leverage a collateralized debt position in a safe and efficient way, by abstracting its management into a simple index. It enables market participants to take on leverage while minimizing the transaction costs and risks associated with maintaining collateralized debt. MATIC2x-FLI-P targets a long 2x exposure to MATIC and employs a flexible leverage mechanism for optimal rebalancing outcomes.'
}

export const IMaticFLIP = {
    name: 'Inverse MATIC Flexible Leverage Index',
    symbol: 'iMATIC-FLI-P',
    address: undefined,
    polygonAddress: '0x340f412860dA7b7823df372a2b59Ff78b7ae6abc',
    decimals: 18,
    image: imaticflipLogo,
    coingeckoId: 'index-coop-inverse-matic-flexible-leverage-index',
    tokensetsId: 'imatic-fli-p',
    tokenSelector: 'imatic-fli-p',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
        mintRedeemFee: '0.1%',
    },
    ethereumABI: undefined,
    polygonABI: polygonABI_maticflip,
    commonABI: commonABI,
    about: 'The Inverse MATIC Flexible Leverage Index on Polygon (iMATIC-FLI-P) lets you leverage a collateralized debt position in a safe and efficient way, by abstracting its management into a simple index. It enables market participants to take on leverage while minimizing the transaction costs and risks associated with maintaining collateralized debt. iMATIC-FLI-P targets a short -1x exposure to MATIC and employs a flexible leverage mechanism for optimal rebalancing outcomes.'
}

export const IEthereumFLIP = {
    name: 'Inverse ETH Flexible Leverage Index',
    symbol: 'iETH-FLI-P',
    address: undefined,
    polygonAddress: '0x4f025829C4B13dF652f38Abd2AB901185fF1e609',
    decimals: 18,
    image: iethflipLogo,
    coingeckoId: 'index-coop-inverse-eth-flexible-leverage-index',
    tokensetsId: 'ieth-fli-p',
    tokenSelector: 'ieth-fli-p',
    linktype: '',
    fees: {
        streamingFee: '1.95%',
        mintRedeemFee: '0.1%',
    },
    ethereumABI: undefined,
    polygonABI: polygonABI_iethflip,
    commonABI: commonABI,
    about: 'The Inverse ETH Flexible Leverage Index on Polygon (iETH-FLI-P) lets you leverage a collateralized debt position in a safe and efficient way, by abstracting its management into a simple index. It enables market participants to take on leverage while minimizing the transaction costs and risks associated with maintaining collateralized debt. iETH-FLI-P targets a short -1x exposure to ETH and employs a flexible leverage mechanism for optimal rebalancing outcomes.'
}

export const ICETH = {
    name: 'Interest Compounding ETH Index',
    symbol: 'icETH',
    address: '0x7c07f7abe10ce8e33dc6c5ad68fe033085256a84',
    decimals: 18,
    polygonAddress: undefined,
    image: 'https://assets.coingecko.com/coins/images/24483/small/icETH-token-logo.png?1647826356',
    coingeckoId: 'interest-compounding-eth-index',
    tokensetsId: 'iceth',
    tokenSelector: 'iceth',
    fees: {
        streamingFee: '0.75%',
        mintRedeemFee: '0.0%',
    },
    ethereumABI: ethereumABI_iceth,
    polygonABI: undefined,
    commonABI: commonABI,
    about: 'The Interest Compounding ETH Index (icETH) enhances staking returns with a leveraged liquid staking strategy. Built on Sets battle-tested leverage token infrastructure, icETH multiplies the staking rate for stETH while minimizing transaction costs and risk associated with maintaining collateralized debt in Aave. Token holders retain spot exposure to ETH and amplify staking returns up to 2.5x.'
}

export const IBTCFLIP = {
    name: 'Inverse BTC Flexible Leverage Index',
    symbol: 'iBTC-FLI-P',
    address: undefined,
    polygonAddress: '0x130ce4e4f76c2265f94a961d70618562de0bb8d2',
    decimals: 18,
    image: 'https://assets.coingecko.com/coins/images/24177/small/iBTC-FLI-P_pulse_red.png?1646749712',
    coingeckoId: 'inverse-btc-flexible-leverage-index',
    tokensetsId: 'ibtc-fli-p',
    tokenSelector: 'ibtc-fli-p',
    fees: {
        streamingFee: '1.95%',
        mintRedeemFee: '0.1%',
    },
    ethereumABI: undefined,
    polygonABI: polygonABI_ibtcflip,
    commonABI: commonABI,
    about: 'The Inverse BTC Flexible Leverage Index on Polygon (iBTC-FLI-P) lets you leverage a collateralized debt position in a safe and efficient way, by abstracting its management into a simple index. It enables market participants to take on leverage while minimizing the transaction costs and risks associated with maintaining collateralized debt. iBTC-FLI-P targets a short -1x exposure to BTC and employs a flexible leverage mechanism for optimal rebalancing outcomes.'
}

export const JGP = {
    name: 'JPG NFT Index',
    symbol: 'JPG',
    address: '0x02e7ac540409d32c90bfb51114003a9e1ff0249c',
    decimals: 18,
    polygonAddress: undefined,
    image: 'https://assets.coingecko.com/coins/images/25071/small/JPG-token-logo-01.png?1650242041',
    coingeckoId: 'jpg-nft-index',
    tokensetsId: 'jpg',
    tokenSelector: 'jpg',
    fees: {
        streamingFee: '5.95%',
        mintRedeemFee: '0.5%',
    },
    ethereumABI: ethereumABI_jpg,
    polygonABI: undefined,
    commonABI: commonABI,
    about: 'The JPG NFT Index (JPG) provides broad exposure to blue-chip and premier NFT collections through a single liquid token. JPG is composed of fungible versions of NFTs such as fractional NFTs, NFT liquidity vaults, NFT curation DAOs, NFT currencies, and wrapped NFTs. Additionally, JPG provides governance rights to vote on the token protocol. '
}

export const productTokensBySymbolList = [
    DefiPulseIndex,
    MetaverseIndex,
    Ethereum2xFlexibleLeverageIndex,
    Ethereum2xFLIP,
    IndexToken,
    Bitcoin2xFlexibleLeverageIndex,
    BedIndex,
    DataIndex,
    GmiIndex,
    Matic2xFLIP,
    IMaticFLIP,
    IEthereumFLIP,
    JGP,
    IBTCFLIP,
    ICETH
]

export const productTokensBySymbol = {
    'DPI': DefiPulseIndex,
    'MVI': MetaverseIndex,
    'ETH2x-FLI': Ethereum2xFlexibleLeverageIndex,
    'ETH2x-FLI-P': Ethereum2xFLIP,
    'INDEX': IndexToken,
    'BTC2x-FLI': Bitcoin2xFlexibleLeverageIndex,
    'BED': BedIndex,
    'DATA': DataIndex,
    'GMI': GmiIndex,
    'M2x-FLI-P': Matic2xFLIP,
    'IM-FLI-P': IMaticFLIP,
    'IEth-FLI-P': IEthereumFLIP,
    'JGP': JGP,
    'IBTCFLIP': IBTCFLIP,
    'ICETH': ICETH
}
