# TradingView 对官方文档的相关理解

TradingView自带包含前端/后台的一套规范

## 数据绑定

因公司后台的接口和调用方式与官方例子有所偏差，服务端相关的设计可忽略，重点放在前端实现逻辑（3.2）

### 3-2.JS Api

对应本地代码 [udf-compatible-datafeed-base.js](/src/components/tradingview/datafeeds/udf/lib/udf-compatible-datafeed-base.js)

### 图表定制

#### 4-2 构造器

通过new TradingView.widget实例化，相关配置参数参考官网文档

#### 4-3 实例方法

可订阅实例状态/数据、修改语言/产品/周期、启用/禁用部分功能、移除实例、导入导出数据、自定义UI控件/对话框等

#### 4-4 图表方法

和实例方法不同，是图表内部的方法，可订阅获取图表K线状态/周期/类型、修改产品/视口数据范围、放大缩小、修改指标/模版、导出数据等

#### 4-5 功能集

图表交互相关的功能集合

其中有一个连接“功能集互动地图”， 可显示图表中的功能位置，并且可以在构造参数的disabled_features、enabled_features字段进行配置

#### 覆盖/指标覆盖/样式覆盖

均可在文档附录内，查到相应的属性配置

## 创建自定义指标

官方示例代码在目录7

也可参考本地自定义指标，在[customIndicators文件夹](/src/components/tradingview/datafeeds/userConfig/customIndicators/index.js)中

本地[KDJ指标](/src/components/tradingview/datafeeds/userConfig/customIndicators/KDJ.js)是基于公司产品提供的公式算法所自定义的（因官方kdj指标未内置到库文件中）

其它指标基本是拷贝官方内置指标的源码，仅对配置作更改，而不修改算法，例如MA.js可一次增加6个ma指标（原ma指标是一个指标一根线）或更改颜色、数字值等

备注：

- 构造参数的custom_indicators_getter字段可导入自定义指标配置

- 图表通过createStudy创建指标并显示在图表内

- 可拷贝源码修改并创建新的自定义指标（名称、颜色、数字、背景,新的计算公式等）

- createStudy的参数可覆盖指标默认值（颜色、数字、背景等）

- 构造参数studies_overrides也可以覆盖指标默认值 ，参考官方文档[指标覆盖](https://zlq4863947.gitbook.io/tradingview/fu-lu/studies-overrides)
