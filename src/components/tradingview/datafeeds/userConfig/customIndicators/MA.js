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
                        color: '#0a74e0'
                    },
                    plot_1: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 35,
                        visible: !0,
                        color: '#e49200'
                    },
                    plot_2: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 35,
                        visible: !0,
                        color: '#d604a4'
                    },
                    plot_3: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 35,
                        visible: !0,
                        color: '#21a900'
                    },
                    plot_4: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 35,
                        visible: !0,
                        color: '#780be4'
                    }
                },
                precision: precision,
                inputs: {
                    in_0: 5,
                    in_1: 20,
                    in_2: 30,
                    in_3: 60,
                    in_4: 250,
                    in_5: 'close',
                    in_6: 0,
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
                },
                {
                    id: 'plot_2',
                    type: 'line'
                },
                {
                    id: 'plot_3',
                    type: 'line'
                },
                {
                    id: 'plot_4',
                    type: 'line'
                }
            ],
            styles: {
                plot_0: {
                    title: 'MA1',
                    histogramBase: 0,
                    joinPoints: !1
                },
                plot_1: {
                    title: 'MA2',
                    histogramBase: 0,
                    joinPoints: !1
                },
                plot_2: {
                    title: 'MA3',
                    histogramBase: 0,
                    joinPoints: !1
                },
                plot_3: {
                    title: 'MA4',
                    histogramBase: 0,
                    joinPoints: !1
                },
                plot_4: {
                    title: 'MA5',
                    histogramBase: 0,
                    joinPoints: !1
                }
            },
            description: 'Moving Average mock',
            shortDescription: 'MA',
            is_price_study: !0,
            inputs: [
                {
                    id: 'in_0',
                    name: 'MA1',
                    defval: 5,
                    type: 'integer',
                    min: 1,
                    max: 300
                }, {
                    id: 'in_1',
                    name: 'MA2',
                    defval: 20,
                    type: 'integer',
                    min: 1,
                    max: 300
                }, {
                    id: 'in_2',
                    name: 'MA3',
                    defval: 30,
                    type: 'integer',
                    min: 1,
                    max: 300
                }, {
                    id: 'in_3',
                    name: 'MA4',
                    defval: 60,
                    type: 'integer',
                    min: 1,
                    max: 300
                }, {
                    id: 'in_4',
                    name: 'MA5',
                    defval: 250,
                    type: 'integer',
                    min: 1,
                    max: 300
                }, {
                    id: 'in_5',
                    name: 'Source',
                    defval: 'close',
                    type: 'source',
                    options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4']
                },
                {
                    id: 'in_6',
                    name: 'Offset',
                    defval: 0,
                    type: 'integer',
                    min: -1e4,
                    max: 1e4
                }
            ],
            id: 'Moving Average mock@tv-basicstudies-1',
            scriptIdPart: '',
        },
        constructor: function () {
            this.main = function (e, t) {
                var i, s, in_0, in_1, in_2, in_3, in_4, in_5, in_6
                return (
                    (this._context = e),
                    (this._input = t),
                    (in_0 = this._input(0)),
                    (in_1 = this._input(1)),
                    (in_2 = this._input(2)),
                    (in_3 = this._input(3)),
                    (in_4 = this._input(4)),
                    (in_5 = n.Std[this._input(5)](this._context)),
                    (in_6 = this._input(6)),
                    (s = this._context.new_var(in_5)),
                    [
                        { value: n.Std.sma(s, in_0, this._context), offset: in_6 },
                        { value: n.Std.sma(s, in_1, this._context), offset: in_6 },
                        { value: n.Std.sma(s, in_2, this._context), offset: in_6 },
                        { value: n.Std.sma(s, in_3, this._context), offset: in_6 },
                        { value: n.Std.sma(s, in_4, this._context), offset: in_6 }
                    ]
                )
            }
        }
    }
}
