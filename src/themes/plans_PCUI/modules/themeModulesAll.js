/**
 * 该主题给wp配置的模块列表
 */

import img from './img/config.js'
// import swipe from './swipe/config.js'
// import notice from './notice/config.js'
import layout from './layout/config.js'
import text from './text/config.js'
import quoteList from './quoteList/config.js'
import selfSymbol from './selfSymbol/config.js'
import fullBanner from './fullBanner/config.js'
import bannerProducts from './bannerProducts/config.js'
import homeNotice from './homeNotice/config.js'
import homeRegister from './homeRegister/config.js'
import homeQuote from './homeQuote/config.js'
import news from './news/config.js'
import backgroundImg from './backgroundImg/config.js'
import footer from './footer/config.js'

export const getThemeModules = async () => {
    return [
        img,
        // swipe,
        // notice,
        layout,
        quoteList,
        selfSymbol,
        fullBanner,
        homeRegister,
        homeNotice,
        news,
        backgroundImg,
        homeQuote,
        bannerProducts,
        footer,
        text
    ]
}
