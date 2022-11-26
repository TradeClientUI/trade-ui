export default function ({ finish, time = 0.6 } = {}) {
    var e = 1; var d = 10; var n = document.body.offsetWidth || document.documentElement.offsetWidth
    var l = {
        getRandomNumberByRange: function (t, e) {
            return Math.floor(Math.random() * (e - t) + t)
        },
        removeMyElement: function (t) {
            var e = t.parentNode
            e && e.removeChild(t)
        },
        getImgPosition: function (t, d, o) {
            var i = 2 + 5 * Math.random()
            var u = 30 * Math.random()
            var c = (n - u) * (this.getRandomNumberByRange(0, 100) / 100)
            var a = this.getRandomNumberByRange(-20, 10)
            return t.src = d,
            t.style.position = 'absolute',
            t.style.left = c + 'px',
            t.style.top = a + '%',
            t.style.width = u + 'px',
            t.style.height = 'auto',
            t.style.opacity = e,
            t.style.animation = o + ' ' + i + 's linear infinite',
            t.style['-webkit-animation'] = o + ' ' + i + 's linear infinite',
            t
        },
        finish: function () {
            if (typeof (finish) === 'function') finish()
            console.log('动画结束')
        },
        init: function () {
            var t = this
            var e = document.createElement('div')
            var u = '//www.imooc.com/static/moco/v1.0/images/redrain/'
            var i = [u + 'redrain-img1.png', u + 'redrain-img2.png', u + 'redrain-img4.png']
            e.className = 'redrain-bg-shade'
            e.style.animation = 'AnimFadeOut ' + time + 's linear 2s forwards'
            document.body.appendChild(e)
            for (var c = 0; c < d; c++) {
                for (var a = 0; a < i.length; a++) {
                    var n = document.createElement('img')
                    var r = 'redPacketsRain'
                    n = this.getImgPosition(n, i[a], r)
                    e.appendChild(n)
                }
            }
            e.addEventListener('animationend', function () {
                t.removeMyElement(e)
                t.finish()
            }, false)
        }
    }
    l.init()
}
