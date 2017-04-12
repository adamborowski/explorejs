import Slider from "bootstrap-slider/dist/bootstrap-slider.js"
import "./Slider.less"


export default () => {
    return {
        restrict: 'E',
        scope: {
            min: "@",
            max: "@",
            step: "@",
            value: "=",
            title: '='
        },
        link: function (scope, elements, attr) {
            var opt = {
                min: Number(scope.min),
                max: Number(scope.max),
                step: Number(scope.step) || 1,
                value: Number(scope.value),
                formatter: scope.title
            };
            if (opt.min > opt.max) {
                opt.reversed = true;
                var a = opt.max;
                opt.max = opt.min;
                opt.min = a;
            }

            var slider = new Slider(elements[0], opt);
            scope.$watch('min', (val)=> slider.min = Number(val));
            scope.$watch('max', (val)=> {
                slider.setAttribute('max', Number(val));
            });
            scope.$watch('step', (val)=> slider.step = Number(val) || 1);
            scope.$watch('value', (val)=> slider.setValue(Number(val)));
            slider.on('change', ()=> {
                scope.value = slider.getValue();
                scope.$apply();
            });

        }
    }
};