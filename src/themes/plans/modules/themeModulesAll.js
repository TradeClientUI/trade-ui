/**
 * 该主题给wp配置的模块列表
 */

import img from './img/config.js'
import swipe from './swipe/config.js'
import notice from './notice/config.js'
import layout from './layout/config.js'
// import quote from './quote/config.js'
// // import infoflow from './infoflow/config.js';
// import infoflow2 from './infoflow2/config.js'
import menulist from './menulist/config.js'
// import position from './position/config.js'
import selfSymbol from './selfSymbol/config.js'
import text from './text/config.js'
// import tinymce from './tinymce/config.js'
import redpacket from './redpacket/config.js'
import template from './template/config.js'
import minePerson from './minePerson/config.js'
// import mineTop from './mineTop/config.js'
import quoteList from './quoteList/config.js'
import nav from './nav/config.js'
import registerForm from './registerForm/config.js'
import news from './news/config.js'
import ad from './ad/config.js'
import luckyWheel from './luckyWheel/config.js'
import productsSwipe from './productsSwipe/config.js'
import productsTimeSharing from './productsTimeSharing/config.js'
import floatComp from './floatComp/config.js'
// import registerType from './registerType/config.js'
// import serviceAgreement from './serviceAgreement/config.js'
// import productsWithIcon from './productsWithIcon/config.js'

export const getThemeModules = async () => {
    return [
        img,
        swipe,
        notice,
        layout,
        // quote,
        // infoflow2,
        menulist,
        // position,
        selfSymbol,
        nav,
        text,
        // tinymce,
        quoteList,
        redpacket,
        template,
        minePerson,
        // mineTop,
        await registerForm(),
        news,
        ad,
        luckyWheel,
        productsSwipe,
        productsTimeSharing,
        floatComp,
        // registerType,
        // serviceAgreement,
        // productsWithIcon
    ]
}
