export default function (n, precision) {
    return {
        metainfo: {
            _metainfoVersion: 27,
            isTVScript: !1,
            isTVScriptStub: !1,
            is_hidden_study: !1,
            defaults: {
                styles: {
                    plot_0: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 35,
                        visible: !0,
                        color: 'red'
                    },
                    plot_1: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 35,
                        visible: !0,
                        color: 'blue'
                    },
                    plot_2: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 35,
                        visible: !0,
                        color: 'green'
                    }
                },
                precision: precision,
                inputs: {
                    in_0: 9,
                    in_1: 3,
                    in_2: 3,
                },
            },
            plots: [
                {
                    id: 'plot_0',
                    type: 'line'
                }, {
                    id: 'plot_1',
                    type: 'line'
                },
                {
                    id: 'plot_2',
                    type: 'line'
                }
            ],
            styles: {
                plot_0: {
                    title: 'Drawings',
                    histogramBase: 0,
                    joinPoints: !1
                },
                plot_1: {
                    title: 'Drawings',
                    histogramBase: 0,
                    joinPoints: !1
                },
                plot_2: {
                    title: 'Drawings',
                    histogramBase: 0,
                    joinPoints: !1
                }
            },
            description: 'Custom KDJ',
            shortDescription: 'KDJ',
            is_price_study: !1,
            inputs: [{
                id: 'in_0',
                name: 'Period',
                defval: 9,
                type: 'integer',
                min: 1,
                max: 2e3
            }, {
                id: 'in_1',
                name: 'Signal',
                defval: 3,
                type: 'integer',
                min: 1,
                max: 2e3
            }, {
                id: 'in_2',
                name: 'Signal',
                defval: 3,
                type: 'integer',
                min: 1,
                max: 2e3
            }
            ],
            id: 'Custom K D J/Divergence@tv-basicstudies-1',
            scriptIdPart: '',
        },
        constructor: function () {
            this.main = function (context, input) {
                // 输入值
                const period = input(0)
                const signal1 = input(1)
                const signal2 = input(2)
                // 基础数据源
                const close = n.Std.close(context)
                const high = n.Std.high(context)
                const low = n.Std.low(context)
                const highSource = context.new_var(high)
                const lowSource = context.new_var(low)

                // 计算
                // 第一步
                // n日RSV=（Cn－Ln）÷（Hn－Ln）×100
                const Cn = close // 当前收盘价
                const Ln = n.Std.lowest(lowSource, period) // n日内的最低价
                const Hn = n.Std.highest(highSource, period) // n日内的最高价
                const RSV = (Cn - Ln) / (Hn - Ln) * 100

                // 第二步
                // 当日K值=2/3×前一日K值＋1/3×当日RSV
                // 当日D值=2/3×前一日D值＋1/3×当日K值
                // J值=3*当日K值-2*当日D值
                // 若无前一日K 值与D值，则可分别用50来代替
                const _prevK = !isNaN(this.prevK) ? this.prevK : 50
                const _prevD = !isNaN(this.prevD) ? this.prevD : 50
                const K = (signal1 - 1) / signal1 * _prevK + 1 / signal1 * RSV
                const D = (signal2 - 1) / signal2 * _prevD + 1 / signal2 * K
                const J = 3 * K - 2 * D
                this.prevK = K
                this.prevD = D
                return [K, D, J]
            }
        }
    }
}
