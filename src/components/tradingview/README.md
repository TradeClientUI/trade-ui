# 使用说明

## demo

```javascript
<template>
    <tv
      ref='chartRef'
      :initialValue="initialValue"
      :options="options"
      :positionList="positionList"
      @symbolChanged="symbolChanged"
      @indicatorRemoved="indicatorRemoved"
      @orientationChanged="orientationChanged"
      @onChartReady="onChartReady" //确保图表创建完成，方可调用图表方法
    />
</template>
<script>
    import { ref, unref } from 'vue'
    export default {
        setup(){
            // 图表组件引用
            const chartRef = ref(null)
            // 图表初始参数
            const initialValue = {
                description: '欧元美元',// 图表左上角名称显示
                symbolId: 1,  //产品id
                digits: '4', //小数点
                tradeType:'1' // 玩法
                interval: '1' //周期
            }
            // 图表其他配置
            const options = {
                // 图表属性
                property: {
                    chartType: '1', // 图表类型
                    showLastPrice: true, // 现价线
                    showPositionPrice: true, // 持仓线
                    showBuyPrice: false, // 买价线
                    showSellPrice: false, // 卖价线
                    showSeriesOHLC: false, // 高开低收
                    showBarChange: false, // 涨跌幅
                    showPriceBox: false, // 价格框
                    showSeriesTitle: false // K线标题
                },
                // 指标
                indicators: [
                    {
                        name: 'Bollinger Bands',
                        params: [true, false, [26, 2]]
                    },
                    {
                        name: 'Custom KDJ',
                        params: [false, false, [9, 3, 3]]
                    }
                ],
                // 扩展
                extension: {
                     theme: 'Light' // 主题 "Light" | "Dark"
                     fullScreen: false // 全屏功能（右上角缩放按钮、横屏监听等）
                     orientation: 'portrait' // 非必填，默认值portrait，可选值: 'portrait' ｜ 'landscape' (竖屏｜横屏)
                }
            }
            // 产品修改成功后回调
            const symbolChanged= (id) =>{}
            // 指标移除后回调
            const indicatorRemoved= (name) =>{}
            // 横屏状态变更后回调
            const orientationChanged= (bool) =>{}
            // 图表实例创建完成后回调
            const onChartReady= () =>{}

            // 图表方法调用示例
            // 切换产品
            const setSymbol = (props) => {
                // props = {
                //     description: '加元日元', // 图表左上角名称显示
                //     symbolId: 2,  // 产品id
                //     digits: '3', // 小数点
                // }
                unref(chartRef).setSymbol(props)
            }
            // 设置图表类型
            const setChartType => () =>{
                unref(chartRef).setChartType(6)
            }
            // 仅覆盖图表属性字段：options.property
            const updateProperty = (options) => {
                unref(chartRef).updateProperty(options)
            }
            // 更新持仓
            const updatePosition = (positions=[]) => {
                // positions = [{ text, quantity, price, color }, ...]
                unref(chartRef).updatePosition(positions)
            }
            // 实时更新tick
            const setTick = (price, time) => {
                unref(chartRef).setTick(price, time)
            }

            return {
                initialValue,
                options,
                symbolChanged,
                indicatorRemoved,
                orientationChanged,
                onChartReady
            }
        }
    }
</script>
```

## 属性

| 参数                                        | 说明     | 类型   |
| ------------------------------------------- | -------- | ------ |
| <font color='red'> \* </font>`initialValue` | 产品属性 | object |
| `options`                                   | 图表配置 | object |

## 回调函数

| 事件名称                                    | 说明               | 回调函数            |
| ------------------------------------------- | ------------------ | ------------------- |
| <font color='red'> \* </font>`onChartReady` | 图表创建完成后触发 | --                  |
| `symbolChanged`                             | 切换产品后触发     | 切换后的产品 id     |
| `indicatorRemoved`                          | 指标移除后触发     | 被移除的指标名称    |
| `orientationChanged`                        | 设备方向变化后触发 | 是否横屏（bool 值） |

## 方法

| 方法名            | 说明                                     | 参数                             | 备注                                     |
| ----------------- | ---------------------------------------- | -------------------------------- | ---------------------------------------- |
| `updateProperty`  | 仅覆盖图表属性字段：property（增量更新） | Function(props: object)          | 参数和 options.property 结构完全一样     |
| `setChartType`    | 设置图表类型                             | Function(props: number)          | --                                       |
| `setResolution`   | 设置图表周期                             | Function(props: sring)           | --                                       |
| `setSymbol`       | 切换产品                                 | Function(props: number \| sring) | --                                       |
| `updateIndicator` | 更新指标（全量更新）                     | Function(props: array \| object) | [{ name: '', params: [] }, ...]          |
| `updateLineData`  | 更新买卖价线（全量更新）                 | Function(props: object)          | { buyPrice, sellPrice }                  |
| `updatePosition`  | 更新持仓 （全量更新）                    | Function(props: array)           | [ { text, quantity, price, color }, ...] |
| `setTick`         | 实时更新 tick                            | Function(price, time)            | --                                       |
| `reset`           | 重新初始化图表                           | Function(cb)                     | --                                       |
| `changeTheme`     | 更改图表主题而不重新加载图表             | Function(props:string)           | "Light"/"Dark"                           |

## 参数说明

| 数据类型     | 说明       | 数据结构                                                                                                                                                      |
| ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| initialValue | 产品属性   | {<br> &emsp;description: '欧元美元',<br>&emsp;symbolId: 1,<br>&emsp;digits: '4'<br>&emsp;tradeType: '1'<br>&emsp;interval: '1'<br>}                           |
| options      | 图表配置   | {<br>&emsp;property: {}, <br>&emsp;indicators: [],<br>&emsp;extension: {}<br>}                                                                                |
| chartType    | 图表类型   | 0:Bar <br>1:Candle <br>2:Line <br>3:Area <br>4:Renko <br>5:Kagi <br>6:PnF <br>7:Line Break <br>8:Heikin-Ashi <br>9:Hollow Candle <br>10:Baseline <br>12:Hi-Lo |
| resolution   | 图表周期   | '1' \| '5' \| '15' \| '30' \| '60' \| '240' \| '1D' \| '1W' \| '1M' \| '10'                                                                                   |
| indicator    | 指标       | [ {name, params}, ... ]                                                                                                                                       |
| positionList | 持仓数据   | [{text, quantity, price, color}, ...]                                                                                                                         |
| lineData     | 买卖价数据 | { <br> &emsp;buyPrice: number, <br> &emsp;sellPrice: number<br>}                                                                                              |
