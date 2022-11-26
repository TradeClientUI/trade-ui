import { Button, Tabbar, TabbarItem, popup, Dialog, Cell, CellGroup, Stepper, Checkbox, CheckboxGroup, Tab, Tabs, ActionSheet, Swipe, SwipeItem, Icon, Loading, Calendar, Empty, Collapse, CollapseItem, Toast, NavBar, Field, Area, List, Search, PullRefresh, DropdownMenu, DropdownItem, Progress, Switch, Radio, RadioGroup, Uploader, NoticeBar, Tag, Picker, Col, Row, popover, sticky, DatetimePicker, Pagination, Step, Steps, Skeleton } from 'vant'

const components = [Button, Tabbar, TabbarItem, popup, Dialog, Cell, CellGroup, Stepper, Checkbox, CheckboxGroup, Tab, Tabs, ActionSheet, Swipe, SwipeItem, Icon, Loading, Calendar, Empty, Collapse, CollapseItem, Toast, NavBar, Field, Area, List, Search, PullRefresh, DropdownMenu, DropdownItem, Progress, Switch, Radio, RadioGroup, Uploader, NoticeBar, Tag, Picker, Col, Row, popover, sticky, DatetimePicker, Pagination, Step, Steps, Skeleton]
const install = (app, options) => {
    components.forEach(component => {
        app.use(component)
    })
}
export default {
    install
}

window['IX_postMessage'] = (win => {
    function IX_postMessage () {
        this.domain = ''
        this.key = ''
        this.inIframe = !(window.self === window.top)
        this.callback = {}
    }
    IX_postMessage.prototype.toMiddlePage = function (data) {
        if (!data) return console.error(new Error('IX_postMessage.toMiddlePage 方法请传入data'))
        if (data.path === '/article') {
            window.vm.$router.push({ path: '/nest/queryinfo', query: { url: data.query.url.replace(/\/\/article/, '/article'), title: data.title || '' } })
        } else {
            window.top.postMessage({ type: 'toPage', data }, '*')
        }
    }
    return new IX_postMessage()
})(window)
