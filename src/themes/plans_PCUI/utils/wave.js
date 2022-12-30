class Wave {
    constructor (e) {
        this.opt = e || {}
        this.K = 2
        this.F = 6
        this.speed = this.opt.speed || 0.001
        this.noise = this.opt.noise || 0
        this.phase = this.opt.phase || 0
        this.canvas = this.opt.canvas
        this.color = this.opt.color || '#fff'
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.MAX = this.height / 2 - 4
        this.canvas.getContext && (this.ctx = this.canvas.getContext('2d'))
        this.run = false
    }

    _globalAttenuationFn (e) {
        return Math.pow(4 * this.K / (4 * this.K + Math.pow(e, 4)), 2 * this.K)
    }

    _drawLine (e, t, n, o) {
        if (this.ctx) {
            this.ctx.moveTo(0, 0)
            this.ctx.beginPath()
            this.ctx.strokeStyle = t
            this.ctx.lineWidth = o || 1
            for (var i, a, r = -this.K; r <= this.K; r += 0.005) {
                i = this.width * ((r + this.K) / (2 * this.K)) * (n || 1)
                a = this.height / 2 + this.noise * this._globalAttenuationFn(r) * (1 / e) * Math.sin(this.F * r - this.phase)
                this.ctx.lineTo(i, a)
            }
            this.ctx.stroke()
        }
    }

    _clear () {
        if (this.ctx) {
            this.ctx.globalCompositeOperation = 'destination-out'
            this.ctx.fillRect(0, 0, this.width, this.height)
            this.ctx.globalCompositeOperation = 'source-over'
        }
    }

    _draw () {
        if (this.run) {
            this.phase = (this.phase + this.speed) % (64 * Math.PI)
            this._clear()
            this._drawLine(4, this.color, 2.2)
            this._drawLine(2, this.color, 2, 0.8)
            this._drawLine(1, this.color, 1.8, 0.5)
            window.requestAnimationFrame && requestAnimationFrame(this._draw.bind(this), 1e4)
        }
    }

    start () {
        this.phase = 0
        this.run = !0
        this._draw()
    }

    stop () {
        this.run = !1
        this._clear()
    }

    setNoise (e) {
        this.noise = Math.min(e, 1) * this.MAX
    }

    setSpeed (e) {
        this.speed = e
    }

    set (e, t) {
        this.setNoise(e)
        this.setSpeed(t)
    }
}

export default Wave
