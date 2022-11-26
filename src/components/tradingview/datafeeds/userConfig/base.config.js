import customIndicatorsGetter from './customIndicators'

// 基本配置
export function genBaseConfig () {
    return {
        autosize: true,
        container: 'tv_chart_container',
        library_path: '/charting_library/',
        custom_css_url: 'customCssUrl.css?v=1.0.2',
        locale: 'zh',
        charts_storage_api_version: '1.1',
        user_id: 'public_user_id',
        theme: 'Light', // "Light" | "Dark"
        timezone: 'Asia/Shanghai',
        custom_indicators_getter: customIndicatorsGetter,
        overrides: {
            'paneProperties.legendProperties.showSeriesTitle': false, // 隐藏K线标题
            'paneProperties.legendProperties.showSeriesOHLC': false, // 显示高开低收
            'paneProperties.legendProperties.showBarChange': false, // 涨跌幅
            'paneProperties.legendProperties.showLegend': true,
            // 边际（百分比）。 用于自动缩放。
            'paneProperties.topMargin': 22,
            'paneProperties.bottomMargin': 5,
            'timeScale.rightOffset': 5,
            // 数据列风格。 请参阅下面的支持的值
            //  Bars = 0            #美国线
            //  Candles = 1         #K线图
            //  Line = 2            #线形图
            //  Area = 3            #面积图
            //  Heiken Ashi = 8     #平均K线图
            //  Hollow Candles = 9  #空心K线图
            //  Renko = 4           #转形图
            //  Kagi = 5            #卡吉图
            //  Point&Figure = 6    #点数图
            //  Line Break = 7      #新价图
            'mainSeriesProperties.style': 1, // K线样式 0美国K线 1K线 2线形图 3面积图
            'mainSeriesProperties.showPriceLine': false, // 现价线
            'scalesProperties.showSeriesLastValue': false, // 现价标签 (配置出的现价线标签会重复显示多个的bug，因此改为手动创建现价线)
            'mainSeriesProperties.priceLineColor': 'rgb(71, 127, 211)',
            'mainSeriesProperties.priceAxisProperties.autoScaleDisabled': false,
            'mainSeriesProperties.priceAxisProperties.percentage': false,
            'mainSeriesProperties.priceAxisProperties.percentageDisabled': false,
            'mainSeriesProperties.priceAxisProperties.log': false,
            'mainSeriesProperties.priceAxisProperties.logDisabled': false
        },
        disabled_features: [
            // 头部工具栏
            'header_widget',
            // K线类型
            // 'header_chart_type',
            // K线周期
            // 'header_resolutions',
            // 指标工具
            // 'header_indicators',
            // 左边工具栏
            'left_toolbar',
            // 底部时间栏目
            'timeframes_toolbar',
            // 头部设置按钮
            'header_settings',
            // 头部全屏按钮
            'header_fullscreen_button',
            // 底部控制按钮
            'control_bar',
            // 左上角产品名称部件
            'legend_context_menu',
            // 在表单左上角元素信息中隐藏“设置”按钮
            // 'edit_buttons_in_legend',
            // 在表单左上角元素信息中隐藏“设置”按钮
            'symbol_info',
            // “撤销”、“重做”按钮
            'header_undo_redo',
            // 成交量是否显示
            'create_volume_indicator_by_default',
            // k线与销量分开
            // 'volume_force_overlay',
            // 图表右键菜单
            'pane_context_menu',
            // 照相机
            'header_screenshot',
            // 上传下载按钮
            'header_saveload',
            // 移动端可以隐藏logo
            'adaptive_logo',
            // 指标模板
            'study_templates',
            // 图表对比
            'header_compare',
            // 市场状态
            'display_market_status',
            // 用户本地存储
            'use_localstorage_for_settings',
            // 搜索
            'header_symbol_search',
            'symbol_search_hot_key',

            'high_density_bars',
            // 禁用右边价格坐标弹窗
            'scales_context_menu',
            // 禁用图表上下滑动，上下滑动是直接滑动页面
            //'vert_touch_drag_scroll',
            // 显示有关可能的鼠标/快捷键/ UI操作的弹出提示
            'popup_hints',
            'pinch_scale'

        ],
        enabled_features: [
            // 指标栏目
            'dont_show_boolean_study_arguments',
            // 阻止滚动到第一个历史 K 线的左侧
            'fix_left_edge',
            'hide_left_toolbar_by_default',
            'chart_zoom'
        ],

    }
}
