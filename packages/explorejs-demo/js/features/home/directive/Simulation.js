import './Simulation.less'
import Arrow from "./sim/Arrow"

class Ball {
    constructor(x, y, r) {
        this.r = r;

        this.point = new paper.Point(x, y);

        var gradient = new paper.Gradient(["#ffcc33", 'black'], true);

        var ball = new paper.CompoundPath({
            children: [
                new paper.Path.Circle({
                    radius: r
                }),
                new paper.Path.Circle({
                    center: -r * 3 / 7,
                    radius: r / 4
                })
            ],
            fillColor: new paper.Color(gradient, 0, r, r * 8 / 8),
        });


        this.item = new paper.Group({
            children: [ball],
            transformContent: false,
            position: this.point
        });
    }


}

class PhysicSimulator {
    render(t_sec) {

    }
}

class SimToRealUnitConverter {
    constructor() {
        this.pixelsPerMeter = 100;//jeden metr ma 100 pixeli na ekranie
    }

    getPixelsForMeters(meters) {
        return meters * this.pixelsPerMeter;
    }



}


class Simulator {

    drawScale() {
        var arrowWidth = this.converter.getPixelsForMeters(1);
        if (arrowWidth < this.width * 0.1) {
            arrowWidth *= 10;
            this.arrow.text = "10m";
        }
        else if (arrowWidth > this.width * 0.9) {
            arrowWidth /= 10;
            this.arrow.text = "10 cm";
        }
        else {
            this.arrow.text = "1 m";
        }
        var margin = 20;
        var sx = this.width - arrowWidth - margin;
        var ex = this.width - margin;
        this.arrow.sx = sx;
        this.arrow.ex = ex;
        this.arrow.update();
    }

    constructor(converter, $filter) {
        this.converter = converter;
        this.$filter = $filter;
        var width = this.width = 700;
        var height = this.height = 600;


        this.letter = new paper.PointText({
            point: [width - 57, 50],
            fillColor: '#333333',
            fontFamily: 'Open Sans',
            fontSize: 15
        });


        var arrowMargin = 20;
        this.arrow = new Arrow(0, arrowMargin, 0, arrowMargin, true, "1 metr");

        this.radius = 0.25;//metry??
        this.ball = new Ball(0, 0, 1);
        this.angle = 5;
        this.g = 9.81;
        this.lastRotation = 0;
        this.slopeHeight = 1;

        this.line = new paper.Path({
            strokeColor: 'black',
            strokeWidth: 2,
            fillColor: '#553344',
            closed: true,
            segments: [
                [-1, 0],
                [width + 1, 0],
                [width + 1, height + 1],
                [-1, height + 1]
            ]
        });
        //todo setup gropund properly, especially not moving points
        this.ground = new paper.Path({
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: '#337744',
            closed: true,
            segments: [
                [-1, 0],
                [width + 1, 0],
                [width + 1, height + 1],
                [-1, height + 1]
            ]
        });


    }

    updateSlope() {
        var angle = this.angle / 180 * Math.PI;
        var sx = 0;
        var sy = this.converter.getPixelsForMeters(this.radius * 2);

        var vOffset = this.vOffset = this.height - this.converter.getPixelsForMeters(this.radius * 2 + this.slopeHeight) - 10;//10 for ground space

        sy += vOffset;



        var ex = this.width;
        var ey = (ex - sx) / Math.cos(angle) * Math.sin(angle) + sy;

        this.line.segments[0].point.y = sy;
        this.line.segments[1].point.y = ey;


        this.line.segments[2].point.y = this.converter.getPixelsForMeters(this.slopeHeight) + sy;
        this.line.segments[3].point.y = this.converter.getPixelsForMeters(this.slopeHeight) + sy;

        //todo move ground
        this.ground.segments[0].point.y = this.converter.getPixelsForMeters(this.slopeHeight) + sy;
        this.ground.segments[1].point.y = this.converter.getPixelsForMeters(this.slopeHeight) + sy;
        this.ground.segments[2].point.y = this.height + 1;
        this.ground.segments[3].point.y = this.height + 1;



    }

    getTimeForEnd() {
        var angle = this.angle / 180 * Math.PI;
        var sin_angle = Math.sin(angle);
        var endDistance = this.slopeHeight / sin_angle;
        return this.getTimeForDistance(endDistance);
    }

    getTimeForDistance(distance) {
        var angle = this.angle / 180 * Math.PI;
        var sin_angle = Math.sin(angle);
        var cos_angle = Math.cos(angle);
        return Math.sqrt((distance) / (5 / 14 * this.g * sin_angle));
    }

    renderFrame(time) {
        this.letter.content = "" + this.$filter('number')(time, 2) + ' s.';

        this.calculateDisplayScale(this);

        var angle = this.angle / 180 * Math.PI;
        var sin_angle = Math.sin(angle);
        var cos_angle = Math.cos(angle);


        var s_t = 5 / 14 * this.g * sin_angle * time * time;

        var dx_t = s_t * cos_angle;
        var dy_t = s_t * sin_angle;


        var offx = sin_angle * this.radius;
        var offy = cos_angle * this.radius;






        this.updateSlope();
        this.drawScale();

        this.ball.item.position.x = this.converter.getPixelsForMeters(dx_t + offx);
        this.ball.item.position.y = this.converter.getPixelsForMeters(dy_t - offy + this.radius * 2) + this.vOffset;


        if (this.radius > 0) {
            var length = 2 * Math.PI * this.radius;
            var d_w = s_t / (length) * 2 * Math.PI;
            d_w = d_w / Math.PI * 180;
            this.ball.item.rotate(d_w - this.lastRotation);
            this.lastRotation = d_w;
        }


        //update ball
        if (this.radius > 0) {
            var meters = this.converter.getPixelsForMeters(this.radius);
            this.ball.item.scaling = meters;
        }
    }

    calculateDisplayScale() {

        var angle = this.angle / 180 * Math.PI;
        var sin_angle = Math.sin(angle);
        var cos_angle = Math.cos(angle);

        var verticalRatio = this.height / (this.slopeHeight + this.radius * 2);

        var slopeWidth = this.slopeHeight / sin_angle;


        //console.log('slopeW', slopeWidth, 'slopeH', this.slopeHeight);


        var horizontalRatio = this.width / (slopeWidth);

        //console.log('v', verticalRatio, 'h', horizontalRatio);


        var ratio = Math.min(verticalRatio, horizontalRatio);//nie takie min, takie, w ktorym


        this.converter.pixelsPerMeter = ratio;
    }


}


class Simulation {

    constructor($filter, scope, element, attrs) {


        var canvas = document.createElement("canvas");
        element[0].appendChild(canvas);


        // Create an empty project and a view for the canvas:
        paper.setup(canvas);

        paper.view.viewSize = new paper.Size(700, 600);


        var simulator = new Simulator(new SimToRealUnitConverter(), $filter);

        function updateEndTime() {
            scope.endTime = simulator.getTimeForEnd();
        }

        simulator.renderFrame(attrs.time);

        scope.$watch("time", (value)=> {
            simulator.renderFrame(Number(value));
            paper.view.draw();
        });

        scope.$watch("angle", (value)=> {
            simulator.angle = Number(value);
            simulator.renderFrame(Number(attrs.time));
            updateEndTime();
            paper.view.draw();
        });

        scope.$watch("radius", (value)=> {
            simulator.radius = Number(value) / 100; //cm->m
            simulator.renderFrame(Number(attrs.time));
            updateEndTime();
            paper.view.draw();
        });

        scope.$watch("slopeHeight", (value)=> {
            simulator.slopeHeight = Number(value) / 100; //cm->m
            simulator.renderFrame(Number(attrs.time));
            updateEndTime();
            paper.view.draw();
        });

        paper.view.draw();


    }

}


export default ($filter) => {
    return {
        restrict: 'E',
        scope: {
            time: "@",
            angle: "@",
            radius: "@",
            slopeHeight: "@",
            endTime: "="
        },
        link: function () {
            return new Simulation($filter, ...arguments)
        }
    }
};