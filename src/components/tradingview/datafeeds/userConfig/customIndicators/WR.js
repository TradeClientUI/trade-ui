export default function (n, precision) {
    return {
        metainfo: {
            _metainfoVersion: 27,
            isTVScript: !1,
            isTVScriptStub: !1,
            is_price_study: !1,
            is_hidden_study: !1,
            defaults: {
                styles: {
                    plot_0: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: "#7E57C2"
                    }
                },
                precision: 4,
                bands: [{
                    color: "#787B86",
                    linestyle: 2,
                    linewidth: 1,
                    visible: !0,
                    value: -20
                }, {
                    color: "#787B86",
                    linestyle: 2,
                    linewidth: 1,
                    visible: !0,
                    value: -80
                }],
                filledAreasStyle: {
                    fill_0: {
                        color: "#7E57C2",
                        transparency: 90,
                        visible: !0
                    }
                },
                inputs: {
                    in_0: 14
                }
            },
            plots: [{
                id: 'plot_0',
                type: 'line'
            }],
            styles: {
                plot_0: {
                    title: 'Plot',
                    histogramBase: 0,
                    joinPoints: !1
                }
            },
            bands: [{
                id: 'hline_0',
                name: 'UpperLimit'
            }, {
                id: 'hline_1',
                name: 'LowerLimit'
            }],
            filledAreas: [{
                id: 'fill_0',
                objAId: 'hline_0',
                objBId: 'hline_1',
                type: 'hline_hline',
                title: 'Hlines Background'
            }],
            inputs: [{
                id: 'in_0',
                name: 'length',
                defval: 14,
                type: 'integer',
                min: 1,
                max: 2e3
            }],
            description: 'Custom Williams %R',
            shortDescription: 'WR',
            id: 'Custom Williams %R@tv-basicstudies-1',
            scriptIdPart: '',
        },
        constructor: function () {
            this.f_0 = function (e, t, i) {
                return 100 * (e - t) / (t - i)
            }
            ,
            this.main = function (e, t) {
                var i, o, r, s, a, l, c
                return this._context = e,
                this._input = t,
                i = this._input(0),
                o = n.Std.high(this._context),
                r = this._context.new_var(o),
                s = n.Std.highest(r, i, this._context),
                a = n.Std.low(this._context),
                l = this._context.new_var(a),
                c = n.Std.lowest(l, i, this._context),
                [this.f_0(n.Std.close(this._context), s, c)]
            }
        }
    }
}
