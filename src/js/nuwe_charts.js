
(function (glob) {
    var version = "0.0.1",
        loaded = false,
        Str = String,
        lowerCase = Str.prototype.toLowerCase,
        objectToString = Object.prototype.toString,
        nu = "number",
        string = "string",
        array = "array",
        toString = "toString";

    /* 
    ** nuwe_charts constructor function
    **
    ** Most Common Type and this is what is only supported at the moment.
    ** nuwe_charts("canvas", {width: 300, height: 300})
    **
    */
    function nuwe_charts(first) {
        if (nuwe_charts.is(first, "function")) {
            return loaded ? first() : eve.on("raphael.DOMload", first);
        } else if (nuwe_charts.is(first, array)) {
            console.log(first);
            // return nuwe_charts._engine.create[apply](nuwe_charts, first.splice(0, 3 + nuwe_charts.is(first[0], nu))).add(first);
        } else {
            console.log(first);
            var args = Array.prototype.slice.call(arguments, 0);
            // the first argument is the container id 
            if (args.length > 0) {
                nuwe_charts.containerID = args[0];
            }
            // second argument option
            if (args.length > 1) {
                var option = args[1];
                // overwrite default nuwe_charts options
                for (var propertyName in option) {
                    nuwe_charts.option[propertyName] = option[propertyName];
                }
            }
            nuwe_charts.init();
            nuwe_charts.drawMainElements();
            nuwe_charts.loadingDial();
        }
    }

    nuwe_charts.version = version;
    nuwe_charts.option = {
        width: 420,
        height: 420,
        innerRadius: 112,
        radiusStep: 31,
        strokeWidth: 29,
        imageWidth: 33,
        imageHeight: 19,
    

        /* Color Variables */
        innerCircleFillColor: '#00b1e8',
        innerCircleStrokeColor: '#00b1e8',

        backCircleStrokeColor: '#eeeeee',

    // Data Value
        amount: [],
        textPS: [
            {
                size: 48,
                top: 0
            },
            {
                size: 32,
                top: 45
            }
        ],
        colorTable: ['#009D76', '#ff8300', '#cd3df6'],
    }
        /* Private variables */
    nuwe_charts.svgElements = {
        _innerCircle: {},
        _backCircle: [], 
        _theArc: [], 
        _theInnerArc: [],
        _innerCircleAnim: [],
        _anim: []
    };

    
    nuwe_charts.init = function() {
        nuwe_charts._paper = Raphael(nuwe_charts.containerID, nuwe_charts.option.width, nuwe_charts.option.height);

        nuwe_charts._paper.customAttributes.arc = function(xloc, yloc, value, total, R, direction, offset) {
            var alpha = 360 / total * (value-offset),
                a = ( 90 - alpha) * Math.PI / 180,
                x = xloc + R * direction * Math.cos(a),
                y = yloc - R * Math.sin(a),
                path;
            if (total == value) {
                path = [
                    ['M', xloc + offset, yloc - R],
                    ['A', R, R, 0, 1, 1, xloc - 0.01, yloc - R]
                    ];
            } else {
                path = [
                    ['M', xloc + offset * 4, yloc - R],
                    ['A', R, R, 0, +(alpha > 180), (1 + direction) / 2, x, y]
                    ];
            }
            return {
                path: path
            };
        };
       
    };

    /* Raphael Circles Preparation */
    nuwe_charts.drawMainElements = function() {
        // Rapahel Inner-most Circle
        nuwe_charts.svgElements._innerCircle = nuwe_charts._paper.circle(
            nuwe_charts.option.width / 2, 
            nuwe_charts.option.height / 2, 
            nuwe_charts.option.innerRadius - nuwe_charts.option.strokeWidth / 2 - 3);
        nuwe_charts.svgElements._innerCircle.attr('fill', nuwe_charts.option.innerCircleFillColor).attr('stroke', nuwe_charts.option.innerCircleStrokeColor);


        var i, j;
        for (i = 0; i < 3; i++) {
            // The Rails
            nuwe_charts.svgElements._backCircle[i] = nuwe_charts._paper.circle(nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, nuwe_charts.option.innerRadius + nuwe_charts.option.radiusStep * i).attr({
                'stroke': nuwe_charts.option.backCircleStrokeColor,
                'stroke-width': nuwe_charts.option.strokeWidth
            });

            nuwe_charts.svgElements._theArc[i] = nuwe_charts._paper.path().attr({
                'stroke': nuwe_charts.option.colorTable[i],
                'stroke-width': nuwe_charts.option.strokeWidth,
                arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000, 1000, nuwe_charts.option.innerRadius + nuwe_charts.option.radiusStep * i, (i % 2 *2 - 1), 0]
            }); 

        }
    };

    nuwe_charts.loadingDial = function() {
        // For now we will fix it with 1000
        var amount = 1000;

        // We are going to have 6 animations, and prepare Raphael animation array.
        for (i = 0; i < 6; i++) {
            nuwe_charts.svgElements._anim[i]  = [];
        }
        
        for (i = 0; i < 3; i++) {
            
            if (i !== 0) {
                // Clockwise animation
                nuwe_charts.svgElements._anim[0][i] = Raphael.animation({
                    arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 0 , 1000, 
                    nuwe_charts.option.innerRadius + nuwe_charts.option.radiusStep * i, (i % 2 *2 - 1), 0]
                }, 900);

                // Counter-clockwise animation
                nuwe_charts.svgElements._anim[1][i] = Raphael.animation({
                    arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000, 1000, 
                    nuwe_charts.option.innerRadius + nuwe_charts.option.radiusStep * i, (i % 2 *2 - 1), 0]
                }, 900);
                // Enlarge Animation
                nuwe_charts.svgElements._anim[2][i] = Raphael.animation({
                    arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000 , 1000, 
                    nuwe_charts.option.innerRadius + nuwe_charts.option.radiusStep * (i + 1), (i % 2 *2 - 1), 0]
                }, 400, 'backOut');

            } else {
                // Clockwise animation
                nuwe_charts.svgElements._anim[0][i] = Raphael.animation({
                    arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 0 , 1000, 
                    nuwe_charts.option.innerRadius + nuwe_charts.option.radiusStep * i, (i % 2 *2 - 1), 0]
                }, 900, function () {
                    // Breakpoint to cancel the animation if the value loaded from server.
                    nuwe_charts.svgElements._theArc[0].animateWith(nuwe_charts.svgElements._theArc[1], nuwe_charts.svgElements._anim[1][1], nuwe_charts.svgElements._anim[1][0].delay(300));
                    nuwe_charts.svgElements._theArc[1].animateWith(nuwe_charts.svgElements._theArc[2], nuwe_charts.svgElements._anim[1][2], nuwe_charts.svgElements._anim[1][1].delay(300));
                    nuwe_charts.svgElements._theArc[2].animateWith(nuwe_charts.svgElements._theArc[0], nuwe_charts.svgElements._anim[1][0], nuwe_charts.svgElements._anim[1][2].delay(300));
                });
                // Counter-clockwise animation
                nuwe_charts.svgElements._anim[1][i] = Raphael.animation({
                    arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000, 1000, nuwe_charts.option.innerRadius + nuwe_charts.option.radiusStep * i, (i % 2 *2 - 1), 0]
                }, 900, function() {
                    // Another breakpoint to cancel the animation if the value loaded from server.
                    nuwe_charts.svgElements._theArc[0].animate(nuwe_charts.svgElements._anim[2][0]).animate(nuwe_charts.svgElements._anim[3][0].delay(400));
                    nuwe_charts.svgElements._theArc[1].animate(nuwe_charts.svgElements._anim[2][1].delay(200)).animate(nuwe_charts.svgElements._anim[3][1].delay(600));
                    nuwe_charts.svgElements._theArc[2].animate(nuwe_charts.svgElements._anim[2][2].delay(400)).animate(nuwe_charts.svgElements._anim[3][2].delay(800));
                });

                // Enlarge animation
                nuwe_charts.svgElements._anim[2][i] = Raphael.animation({
                    arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000, 1000, nuwe_charts.option.innerRadius + nuwe_charts.option.radiusStep * (i + 1), 1, 0]
                }, 400, 'backOut');

            }
            if (i === 2) {
                // Back to origin animation
                nuwe_charts.svgElements._anim[3][i] = Raphael.animation({
                    arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000, 1000, nuwe_charts.option.innerRadius + nuwe_charts.option.radiusStep * i, 1, 0]
                }, 500, 'bounce', function() {
                    opacityRing.animate(opacityAnim.delay(300));
                });

                // Final Loading animation
                nuwe_charts.svgElements._anim[5][i] = Raphael.animation({
                    arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000, 1000, nuwe_charts.option.innerRadius + nuwe_charts.option.radiusStep * i, 1, 0]
                }, 400, 'bounce', function() {
                    animating = false;
                });

            } else {
                // Back to origin animation
                nuwe_charts.svgElements._anim[3][i] = Raphael.animation({
                    arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000 , 1000, nuwe_charts.option.innerRadius + nuwe_charts.option.radiusStep * i, 1, 0]
                }, 500, 'backIn');
                nuwe_charts.svgElements._anim[5][i] = Raphael.animation({
                    arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000, 1000, nuwe_charts.option.innerRadius + nuwe_charts.option.radiusStep * i, 1, 0]
                }, 400, 'bounce');
            }

            // Shrink Animation Define
            nuwe_charts.svgElements._anim[4][i] = Raphael.animation({
                arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000, 1000, nuwe_charts.option.innerRadius + nuwe_charts.option.radiusStep * (i - 1), 1, 0]
            }, 400, 'bounce');


        }

        nuwe_charts.svgElements._innerCircleAnim[0] = Raphael.animation({
            r: nuwe_charts.option.innerRadius - nuwe_charts.option.strokeWidth * 3 / 2 - 5
        }, 400, 'bounce');

        nuwe_charts.svgElements._innerCircleAnim[1] = Raphael.animation({
            r: nuwe_charts.option.innerRadius - nuwe_charts.option.strokeWidth / 2 - 5
        }, 400, 'bounce');

        // Opacity animation : Animation Step 3.5
        // Repeat animation 3 times
        var n = 0;
        var opacityAnim = Raphael.animation({
            'stroke-width': nuwe_charts.option.width / 2,
            arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000, 1000, nuwe_charts.option.width / 4, 1, 0]
        }, 600, 'ease', function() {
            opacityRing.animate(opacityAnim1);
        });
        var opacityAnim1 = Raphael.animation({
            'stroke-width': 0,
            arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000, 1000, nuwe_charts.option.width / 2, 1, 0]
        }, 600, 'ease', function() {
            opacityRing.attr({'arc': [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000, 1000, 0, 1, 0]});
            n++;
            if (n > 4) {
                nuwe_charts.svgElements._innerCircle.animate(nuwe_charts.svgElements._innerCircleAnim[0]).animate(nuwe_charts.svgElements._innerCircleAnim[1].delay(900));
                nuwe_charts.svgElements._theArc[0].animate(nuwe_charts.svgElements._anim[4][0].delay(300)).animate(nuwe_charts.svgElements._anim[5][0].delay(900));
                nuwe_charts.svgElements._theArc[1].animate(nuwe_charts.svgElements._anim[4][1].delay(500)).animate(nuwe_charts.svgElements._anim[5][1].delay(1100));
                nuwe_charts.svgElements._theArc[2].animate(nuwe_charts.svgElements._anim[4][2].delay(700)).animate(nuwe_charts.svgElements._anim[5][2].delay(1300));
            } else {
                opacityRing.animate(opacityAnim.delay(200));
            }
        });

        var opacityRing = nuwe_charts._paper.path().attr({
            'stroke': '#FFFFFF',
            'opacity': 0.5,
            'stroke-width': 0,
            arc: [nuwe_charts.option.width / 2, nuwe_charts.option.height / 2, 1000, 1000, 0, (i % 2 *2 - 1), 0]
        });

        
        nuwe_charts.svgElements._theArc[0].animateWith(nuwe_charts.svgElements._theArc[1], nuwe_charts.svgElements._anim[0][1], nuwe_charts.svgElements._anim[0][0]);
        nuwe_charts.svgElements._theArc[1].animateWith(nuwe_charts.svgElements._theArc[2], nuwe_charts.svgElements._anim[0][2], nuwe_charts.svgElements._anim[0][1]);
        nuwe_charts.svgElements._theArc[2].animateWith(nuwe_charts.svgElements._theArc[0], nuwe_charts.svgElements._anim[0][0], nuwe_charts.svgElements._anim[0][2]);
    }

    nuwe_charts.prototype.getPaper = function() {
        return nuwe_charts.paper;
    };

    eve.on("raphael.DOMload", function () {
        loaded = true;
    });
    /*\
     * Nuwe Chart
     [ method ]
     **
     * Handful of replacements for `typeof` operator.
     > Parameters
     - o (…) any object or primitive
     - type (string) name of the type, i.e. “string”, “function”, “number”, etc.
     = (boolean) is given value is of given type
    \*/
    nuwe_charts.is = function (o, type) {
        type = lowerCase.call(type);
        if (type == "finite") {
            return !isnan[has](+o);
        }
        if (type == "array") {
            return o instanceof Array;
        }
        return  (type == "null" && o === null) ||
                (type == typeof o && o !== null) ||
                (type == "object" && o === Object(o)) ||
                (type == "array" && Array.isArray && Array.isArray(o)) ||
                objectToString.call(o).slice(8, -1).toLowerCase() == type;
    };
    nuwe_charts.toString = function () {
        return "You are running Nuwe Charts Library " + version;
    };
    (typeof module != "undefined" && module.exports) ? (module.exports = nuwe_charts) : (typeof define != "undefined" ? (define("nuwe_charts", [], function() { return nuwe_charts; })) : (glob.nuwe_charts = nuwe_charts));
})(window || this);