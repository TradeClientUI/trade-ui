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
                    },
                    plot_2: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 35,
                        visible: !0,
                        color: '#fbc02d'
                    }
                },
                precision: precision,
                bands: [
                    {
                        color: '#808080',
                        linestyle: 2,
                        linewidth: 1,
                        visible: !0,
                        value: 70
                    },
                    {
                        color: '#808080',
                        linestyle: 2,
                        linewidth: 1,
                        visible: !0,
                        value: 30
                    }
                ],
                filledAreasStyle: {
                    fill_0: {
                        color: '#800080',
                        transparency: 90,
                        visible: !0
                    }
                },
                inputs: {
                    in_0: 6,
                    in_1: 12,
                    in_2: 24,
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
                },
                plot_2: {
                    title: 'Plot',
                    histogramBase: 0,
                    joinPoints: !1
                }
            },
            description: 'Custom Relative Strength Index',
            shortDescription: 'RSI',
            is_price_study: !1,
            bands: [
                {
                    id: 'hline_0',
                    name: 'UpperLimit'
                },
                {
                    id: 'hline_1',
                    name: 'LowerLimit'
                }
            ],
            filledAreas: [
                {
                    id: 'fill_0',
                    objAId: 'hline_0',
                    objBId: 'hline_1',
                    type: 'hline_hline',
                    title: 'Hlines Background'
                }
            ],
            inputs: [
                {
                    id: 'in_0',
                    name: 'Length',
                    defval: 6,
                    type: 'integer',
                    min: 1,
                    max: 2e3
                }, {
                    id: 'in_1',
                    name: 'Length',
                    defval: 12,
                    type: 'integer',
                    min: 1,
                    max: 2e3
                }, {
                    id: 'in_2',
                    name: 'Length',
                    defval: 24,
                    type: 'integer',
                    min: 1,
                    max: 2e3
                }
            ],
            id: 'Custom Relative Strength Index@tv-basicstudies-1',
            scriptIdPart: '',
        },
        constructor: function () {
            ; (this.f_0 = function (e) {
                return n.Std.max(e, 0)
            }),
            (this.f_1 = function (e) {
                return -n.Std.min(e, 0)
            }),
            (this.f_2 = function (e, t) {
                return n.Std.eq(e, 0) ? 100 : n.Std.eq(t, 0) ? 0 : 100 - 100 / (1 + t / e)
            }),
            (this.main = function (e, t) {
                var i, o_0, o_1, o_2, r, s, a, l, c_0, c_1, c_2, u, h, d_0, d_1, d_2
                return (
                    (this._context = e),
                    (this._input = t),
                    (i = n.Std.close(this._context)),
                    (o_0 = this._input(0)),
                    (o_1 = this._input(1)),
                    (o_2 = this._input(2)),
                    (r = this._context.new_var(i)),
                    (s = n.Std.change(r)),
                    (a = this.f_0(s)),
                    (l = this._context.new_var(a)),
                    (c_0 = n.Std.rma(l, o_0, this._context)),
                    (c_1 = n.Std.rma(l, o_1, this._context)),
                    (c_2 = n.Std.rma(l, o_2, this._context)),
                    (u = this.f_1(s)),
                    (h = this._context.new_var(u)),
                    (d_0 = n.Std.rma(h, o_0, this._context)),
                    (d_1 = n.Std.rma(h, o_1, this._context)),
                    (d_2 = n.Std.rma(h, o_2, this._context)),
                    [this.f_2(d_0, c_0), this.f_2(d_1, c_1), this.f_2(d_2, c_2)]
                )
            })
        }
    }
}
