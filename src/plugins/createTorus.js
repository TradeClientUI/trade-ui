/**
 * createArcs
 * @param {Object} args 配置项
 * @example createArcs({
      id: div,
      width: 400,
      height: 400,
      r: 180,
      label: '净值',
      text: '54646.55',
      arcWidth: 20,
      data: [
        {color: '#ff0000', percent: 0.2, text: '第1项'},
        {color: '#ffff00', percent: 0.7, text: '第2项'},
        {color: '#ff00ff', percent: 0.1, text: '第3项'}
      ]
    })
 */
export function createTorus (args) {
    var html = '<svg id="ringSvg" class="ring-svg" width="' + args.width + '" height="' + args.width + '" >'
    var cx = args.width / 2; var cy = args.height / 2
    var r = args.r
    var aw = args.arcWidth
    var data = args.data
    var i = 0; var l = 0
    var deltaR = 15 // 鼠标移动上去时候的偏移值
    var circleLong = r * 2 * Math.PI
    var cl2 = (r + deltaR) * 2 * Math.PI
    var currentReg = 0
    var itemData = []

    html += '<text x="50%" y="42%"  style="dominant-baseline:middle;text-anchor:middle;"font-family="Verdana" font-size="14"> ' + args.label + '</text>'
    html += '<text x="50%" y="55%"  style="font-weight:bold;dominant-baseline:middle;text-anchor:middle;" font-family="Verdana" font-size="20"> ' + args.text + ' </text>'

    html += '<circle class="defaut-arc" cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke-width="' + aw + '" stroke="none" fill="none"></circle>'

    l = data.length
    for (i; i < l; i++) {
        html += (function (i) {
            return getCircle(data[i])
        }(i))
    }

    function getCircle (d) {
        var l1 = Math.ceil(circleLong * d.percent)
        var l2 = Math.ceil(circleLong * (1 - d.percent))
        var l3 = Math.ceil(cl2 * d.percent)
        var l4 = Math.ceil(cl2 * (1 - d.percent))
        var html = ''
        // rotate(' + (d.percent * 180 + currentReg * 360) + ', ' + cx + ', ' + cy + ')
        html = '<circle class="arc-item arc-item' + i + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke-width="' + aw + '" stroke="' + d.color + '" fill="none" transform="rotate(' + (-90 + currentReg * 360) + ', ' + cx + ', ' + cy + ')" stroke-dasharray="' + l1 + ' ' + l2 + '"></circle>'

        currentReg = (d.percent * 100 + currentReg * 100) / 100
        itemData.push([l1 + ' ' + l2, l3 + ' ' + l4])
        return html
    }

    html += '</svg>'
    document.getElementById(args.id).innerHTML = html
}
