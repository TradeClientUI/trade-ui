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
                        plottype: 1,
                        trackPrice: !1,
                        transparency: 35,
                        visible: !0,
                        color: '#FF0000'
                    },
                    plot_1: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 35,
                        visible: !0,
                        color: '#0000FF'
                    },
                    plot_2: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 35,
                        visible: !0,
                        color: '#FF0000'
                    }
                },
                precision: precision,
                inputs: {
                    in_0: 12,
                    in_1: 26,
                    in_3: 'close',
                    in_2: 9
                },
                palettes: {
                    plot_0_Palette: {
                        colors: {
                            0: {
                                color: '#eb4d5c', // 涨的颜色
                                width: 1,
                                style: 0
                            },
                            1: {
                                color: '#53b987',   // 跌的颜色
                                width: 1,
                                style: 0
                            }
                        }
                    }
                }
            },
            plots: [{
                id: 'plot_0',
                type: 'line'
            }, {
                id: 'plot_0_Palette',
                palette: 'plot_0_Palette',
                target: 'plot_0',
                type: 'colorer'
            }, {
                id: 'plot_1',
                type: 'line'
            }, {
                id: 'plot_2',
                type: 'line'
            }],
            palettes: {
                plot_0_Palette: {
                    colors: {
                        0: {
                            name: 'Growing'
                        },
                        1: {
                            name: 'Falling'
                        }
                    }
                }
            },
            styles: {
                plot_0: {
                    title: 'Histogram',
                    histogramBase: 0,
                    joinPoints: !1
                },
                plot_1: {
                    title: 'MACD',
                    histogramBase: 0,
                    joinPoints: !1
                },
                plot_2: {
                    title: 'Signal',
                    histogramBase: 0,
                    joinPoints: !1
                }
            },
            description: 'Custom MACD',
            shortDescription: 'MACD',
            is_price_study: !1,
            inputs: [{
                id: 'in_0',
                name: 'fastLength',
                defval: 12,
                type: 'integer',
                min: 1,
                max: 2e3
            }, {
                id: 'in_1',
                name: 'slowLength',
                defval: 26,
                type: 'integer',
                min: 1,
                max: 2e3
            }, {
                id: 'in_3',
                name: 'Source',
                defval: 'close',
                type: 'source',
                options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4']
            }, {
                id: 'in_2',
                name: 'signalLength',
                defval: 9,
                type: 'integer',
                min: 1,
                max: 50
            }],
            id: 'Custom Moving Average Convergence/Divergence@tv-basicstudies-1',
            scriptIdPart: '',
        },
        constructor: function () {
            this.f_0 = function (e, t) {
                return e - t
            }
            this.getColorKey = function (e, t) {
                return e - t > 0 ? 0 : 1
            }
            this.main = function (e, t) {
                var i, o, r, s, a, l, c, u, h, d, p, colorKey
                return this._context = e,
                this._input = t,
                i = n.Std[this._input(2)](this._context),
                o = this._input(0),
                r = this._input(1),
                s = this._input(3),
                a = this._context.new_var(i),
                l = n.Std.ema(a, o, this._context),
                c = this._context.new_var(i),
                u = n.Std.ema(c, r, this._context),
                h = this.f_0(l, u),
                d = this._context.new_var(h),
                p = n.Std.ema(d, s, this._context),
                (colorKey = this.getColorKey(h, p)),
                [this.f_0(h, p), colorKey, h, p]
            }
        }
    }
}
