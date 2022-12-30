// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { getCookie } from '@/utils/util'

// import {
//     ElLoading,
//     ElDialog,
//     ElMessageBox,
//     ElMessage,
//     ElCarousel,
//     ElCarouselItem,
//     ElDropdown,
//     ElDropdownMenu,
//     ElDropdownItem,
//     ElTimeline,
//     ElEmpty,
//     ElPopover,
//     ElTimelineItem,
//     ElTable,
//     ElTableColumn,
//     ElCheckbox,
//     ElOption,
//     ElOptionGroup,
//     ElSelect,
//     ElPagination,
//     ElInput,
//     ElIcon
// } from 'element-plus'

export default function (app) {
    const langName = getI18nLang()
    import('element-plus/es/locale/lang/' + langName).then(res => {
        const locale = res.default
        app.use(ElementPlus, {
            locale
        })
    })

    // app.use(ElLoading).use(ElDialog).use(ElMessageBox).use(ElMessage).use(ElCarousel).use(ElCarouselItem).use(ElDropdown)
    //     .use(ElDropdownMenu).use(ElDropdownItem).use(ElTimeline).use(ElTimelineItem).use(ElEmpty).use(ElPopover).use(ElTable).use(ElTableColumn)
    //     .use(ElCheckbox)
    //     .use(ElOption)
    //     .use(ElOptionGroup)
    //     .use(ElSelect)
    //     .use(ElOption).use(ElOptionGroup).use(ElPagination).use(ElInput).use(ElIcon)
};

// 获取当前国际化语言
function getI18nLang () {
    const lang = getCookie('lang') || 'zh-CN'
    let result = 'en'
    switch (lang) {
    case 'zh-CN':
        result = 'zh-cn'
        break
    case 'zh-HK':
        result = 'zh-tw'
        break
    case 'en-US':
        result = 'en'
        break
    case 'th-TH':
        result = 'th'
        break
    }
    return result
}
