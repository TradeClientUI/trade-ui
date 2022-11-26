import { ElButton } from 'element-plus'
import lang from 'element-plus/lib/locale/lang/'
import locale from 'element-plus/lib/locale'

export default (app) => {
    locale.use(lang)
    app.use(ElButton)
}
