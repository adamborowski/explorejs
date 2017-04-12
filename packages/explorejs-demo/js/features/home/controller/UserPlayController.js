export default class UserPlayController {
    constructor($interval) {
        this.$interval = $interval;
    }

    init(firstFrame, lastFrame, autoplay) {
        this._fps = 40;
        this._direction = 1;
        this._frame = 0;
        this._firstFrame = firstFrame;
        this._lastFrame = lastFrame;
        this._loop = true;
        this._timeScale = 1;
        this._render();
        if (autoplay) {
            this.start();
        }
    }

    _render() {
        //this._frameRenderer.renderFrame(this._frame);
    }

    _nextFrameHandler() {
        //console.debug("timeout handler frame #" + this.frame);
        var nextFrame = null;
        var frame = this.frame;
        if (this.direction == 1) {
            if (frame < this.lastFrame) nextFrame = frame + 1;
            else if (this.loop) nextFrame = this.firstFrame;
        }
        else {
            if (frame > this.firstFrame) nextFrame = frame - 1;
            else if (this.loop) nextFrame = this.lastFrame;
        }
        if (nextFrame != null) {
            this._frame = nextFrame;
            this._render();
        }
    }

    start() {
        if (!this.playing) {
            if (this.direction == 1 && this._frame == this.lastFrame) {
                this._frame = this.firstFrame;
            }
            else if (this.direction == -1 && this._frame == this.firstFrame) {
                this._frame = this.lastFrame;
            }
            this._interval = this.$interval(()=>this._nextFrameHandler(), 1000 / this._fps);
        }
    }

    stop() {
        this.$interval.cancel(this._interval);
        this._interval = null;
    }

    togglePlay() {
        if (this.playing) {
            this.stop();
        }
        else {
            this.start()
        }
    }

    get playing() {
        return this._interval!= null;
    }

    nextFrame() {
        this.stop();
        var nextFrame;
        if (this.frame < this.lastFrame) {
            nextFrame = this.frame + 1;
        }
        else if (this.loop) {
            nextFrame = this.firstFrame;
        }
        if (nextFrame != null) {
            this.gotoFrame(nextFrame);
        }
    }

    prevFrame() {
        this.stop();
        var nextFrame;
        if (this.frame > this.firstFrame) {
            nextFrame = this.frame - 1;
        }
        else if (this.loop) {
            nextFrame = this.lastFrame;
        }
        if (nextFrame != null) {
            this.gotoFrame(nextFrame);
        }
    }

    gotoFrame(val) {
        this._frame = val;
        if (this.playing) {
            this.stop();
            this.start();
        }
        else {
            this._render();
        }

    }

    gotoFirstFrame() {
        this.gotoFrame(this.firstFrame);
    }

    gotoLastFrame() {
        this.gotoFrame(this.lastFrame);
    }

    get frame() {
        return this._frame;
    }

    set frame(val) {
        this.stop();
        this.gotoFrame(val);
    }

    set fps(val) {
        this._fps = val;
        if (this.playing) {
            this.stop();
            this.start();
        }
    }

    get fps() {
        return this._fps;
    }

    get second() {
        return this._frame / this._fps * this.timeScale;
    }

    set second(val) {
        this.gotoFrame(Math.ceil(val * this.fps / this.timeScale));
    }

    set endSecond(val) {
        this._lastFrame = Math.ceil(val * this.fps / this.timeScale);
    }

    get endSecond() {
        return this._lastFrame / this._fps * this.timeScale;
    }


    set direction(val) {
        this._direction = val;
        if (this.playing) {
            this.stop();
            this.start();
        }
    }

    toggleDirection() {
        if (this.direction == 1) {
            this.direction = -1;
        }
        else {
            this.direction = 1;
        }
    }

    get direction() {
        return this._direction;
    }

    set loop(val) {
        this._loop = val;
    }

    get loop() {
        return this._loop;
    }

    toggleLoop() {
        this.loop = !this.loop;
    }

    get firstFrame() {
        return this._firstFrame;
    }

    get lastFrame() {
        return this._lastFrame;
    }

    get timeScale() {
        return this._timeScale;
    }

    set timeScale(val) {
        var second = this.second;
        var endSecond = this.endSecond;
        this._timeScale = val;
        this.second = second;
        this.endSecond = endSecond;
    }
}