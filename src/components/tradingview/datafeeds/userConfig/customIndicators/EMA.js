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
                        color: '#ff6d00'
                    },
                    plot_1: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 35,
                        visible: !0,
                        color: '#26c6da'
                    }
                },
                precision: precision,
                inputs: {
                    in_0: 12,
                    in_1: 26,
                    in_2: 'close',
                    in_3: 0,
                }
            },
            plots: [
                {
                    id: 'plot_0',
                    type: 'line'
                },
                {
                    id: 'plot_1',
                    type: 'line'
                }
            ],
            styles: {
                plot_0: {
                    title: 'Plot',
                    histogramBase: 0,
                    joinPoints: !1
                },
                plot_1: {
                    title: 'Plot',
                    histogramBase: 0,
                    joinPoints: !1
                }
            },
            description: 'Custom Moving Average Exponential',
            shortDescription: 'EMA',
            is_price_study: !0,
            inputs: [
                {
                    id: 'in_0',
                    name: 'Length',
                    defval: 12,
                    type: 'integer',
                    min: 1,
                    max: 1e4
                },
                {
                    id: 'in_1',
                    name: 'Length',
                    defval: 26,
                    type: 'integer',
                    min: 1,
                    max: 1e4
                }, {
                    id: 'in_2',
                    name: 'Source',
                    defval: 'close',
                    type: 'source',
                    options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4']
                }, {
                    id: 'in_3',
                    name: 'Offset',
                    defval: 0,
                    type: 'integer',
                    min: -1e4,
                    max: 1e4
                }
            ],
            id: 'Custom Moving Average Exponential@tv-basicstudies-1',
            scriptIdPart: '',
        },
        constructor: function () {
            this.main = function (e, t) {
                var i, o_0, o_1, r, s, in_0, in_1, in_2, in_3
                return (
                    (this._context = e),
                    (this._input = t),
                    (in_0 = this._input(0)),
                    (in_1 = this._input(1)),
                    (in_2 = this._input(2)),
                    (in_3 = this._input(3)),
                    (i = n.Std[in_2](this._context)),
                    (s = this._context.new_var(i)),
                    [
                        {
                            value: n.Std.ema(s, in_0, this._context),
                            offset: in_3
                        },
                        {
                            value: n.Std.ema(s, in_1, this._context),
                            offset: in_3
                        }
                    ]
                )
            }
        }
    }
}
