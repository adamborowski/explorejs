export default class Arrow {

    init() {
        var sx = this.sx, sy = this.sy, ex = this.ex, ey = this.ey, isDouble = this.isDouble, text = this.text;
        var o = this.objects = {};

        var e = this.calcArrow(sx, sy, ex, ey);
        var s = this.calcArrow(ex, ey, sx, sy);


        var style = {
            strokeColor: '#333333',
            strokeWidth: 1
        };

        var line = o.line = new paper.Path({
            segments: [
                [sx, sy],
                [ex, ey]
            ],
            style: style
        });
        var arrow1 = o.arrow1 = new paper.Path({
            segments: [
                [e[0], e[1]],
                [ex, ey],
                [e[2], e[3]]
            ],
            style: style
        });


        var group = o.group = new paper.Group([line, arrow1], {});
        if (isDouble === true) {
            var arrow2 = o.arrow2 = new paper.Path({
                segments: [
                    [s[0], s[1]],
                    [sx, sy],
                    [s[2], s[3]]
                ],
                style: style
            });

            group.addChild(arrow2);
        }


        if (text != null) {
            var pointText = o.text = new paper.PointText({
                point: [(ex + sx) / 2, (sy + ey) / 2 - 5],
                content: text,
                fillColor: 'black',
                fontFamily: 'Open Sans',
                fontSize: 10,
                justification: 'center'
            });
            group.addChild(pointText);
        }
    }

    update() {
        var sx = this.sx, sy = this.sy, ex = this.ex, ey = this.ey, isDouble = this.isDouble, text = this.text;
        var o = this.objects;

        var e = this.calcArrow(sx, sy, ex, ey);
        var s = this.calcArrow(ex, ey, sx, sy);

        o.line.segments[0].point.x = sx;
        o.line.segments[0].point.y = sy;
        o.line.segments[1].point.x = ex;
        o.line.segments[1].point.y = ey;

        o.arrow1.segments[0].point.x = e[0];
        o.arrow1.segments[0].point.y = e[1];
        o.arrow1.segments[1].point.x = ex;
        o.arrow1.segments[1].point.y = ey;
        o.arrow1.segments[2].point.x = e[2];
        o.arrow1.segments[2].point.y = e[3];

        if (o.arrow2) {
            o.arrow2.segments[0].point.x = s[0];
            o.arrow2.segments[0].point.y = s[1];
            o.arrow2.segments[1].point.x = sx;
            o.arrow2.segments[1].point.y = sy;
            o.arrow2.segments[2].point.x = s[2];
            o.arrow2.segments[2].point.y = s[3];
        }

        if (o.text) {
            o.text.position.x = (ex + sx) / 2;
            o.text.position.y = (sy + ey) / 2 - 5;
            o.text.content = this.text;
        }


    }


    constructor(sx, sy, ex, ey, isDouble, text) {
        this.sx = sx, this.sy = sy, this.ex = ex, this.ey = ey, this.isDouble = isDouble, this.text = text;
        this.init();
    }

    calcArrow(px0, py0, px, py) {
        var points = [];
        var l = Math.sqrt(Math.pow((px - px0), 2) + Math.pow((py - py0), 2));
        points[0] = (px - ((px - px0) * Math.cos(0.5) - (py - py0) * Math.sin(0.5)) * 10 / l);
        points[1] = (py - ((py - py0) * Math.cos(0.5) + (px - px0) * Math.sin(0.5)) * 10 / l);
        points[2] = (px - ((px - px0) * Math.cos(0.5) + (py - py0) * Math.sin(0.5)) * 10 / l);
        points[3] = (py - ((py - py0) * Math.cos(0.5) - (px - px0) * Math.sin(0.5)) * 10 / l);
        return points;
    }

}