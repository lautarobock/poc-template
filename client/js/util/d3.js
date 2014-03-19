define([], function() {

    var d3module = angular.module("dl.d3", []);

    d3module.factory("d3Service", function() {
        return window.d3;
    });

    /**
    Based on @see http://www.ng-newsletter.com/posts/d3-on-angular.html
    */
    d3module.directive('d3Bars', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                data: '=d3BarsData',
                config: '=d3BarsConfig'
            },
            link: function(scope, ele, attrs) {
                // console.log("config", scope);
                var margin = parseInt(attrs.margin) || 20,
                    // barHeight = parseInt(scope.config.bars.thickness) || 20,
                    barPadding = parseInt(scope.config.bars.padding) || 5;
                var margin = {top: 20, right: 20, bottom: 50, left: 70};

                var svg = d3Service.select(ele[0])
                    .append('svg')
                    .style('border-radius','1em')
                    // .style('padding','1em')
                    .style('width', '100%')
                    .style('background', 'white');

                // Browser onresize event
                window.onresize = function() {
                    scope.$apply();
                };

                // Watch for resize event
                scope.$watch(function() {
                    return angular.element($window)[0].innerWidth;
                }, function() {
                    scope.render(scope.data);
                });

                scope.$watch("data",function() {
                   scope.render(scope.data); 
                },true);

                scope.render = function(data) {
                    
                    svg.selectAll('*').remove();

                    // If we don't pass any data, return out of the element
                    if (!data) return;

                    // console.log('offsetHeight',d3.select(ele[0]).node().offsetHeight);
                    // setup variables
                    var width = d3.select(ele[0]).node().offsetWidth - margin.left - margin.right,
                        // calculate the height
                        // height = data.length * (barHeight),
                        height = d3.select(ele[0]).node().offsetHeight - margin.top - margin.bottom,
                        // Use the category20() scale function for multicolor support
                        color = scope.config.bars.color || d3.scale.category20b();


                    //Functions to get Text and Value
                    var getValue = scope.config.data.value;
                    var getText = scope.config.data.text;
                    var getKey = scope.config.data.key;

                    
                    var x;
                    if ( scope.config.bars.vertical ) {
                        x = d3.scale.linear().range([height, 0]);
                    } else {
                        x = d3.scale.linear().range([0, width]);
                    }


                    var serie;
                    if ( scope.config.bars.vertical ) {
                        serie = d3.scale.ordinal().rangeRoundBands([0, width], -0.1);
                    } else {
                        serie = d3.scale.ordinal().rangeRoundBands([height-3, 0], -0.43);
                    }


                    x.domain([0, d3.max(data, function(d) { return getValue(d); })]);
                    serie.domain(data.map(function(d) {
                        return getKey(d);
                    }));
                    

                    // console.log("height", height);
                    var svg2 = svg.attr("height",  height + margin.top + margin.bottom).append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    var barHeight = height / data.length;
                    if ( scope.config.bars.vertical ) {
                        barHeight = width / data.length;
                    }

                    //Add X-Axis
                    if ( scope.config.bars.vertical ) {
                        var xAxis = d3.svg.axis()
                            .scale(x)
                            .orient("left");

                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate("+(margin.left-10)+","+margin.top+")")
                            .call(xAxis);

                        var yAxis = d3.svg.axis()
                            .scale(serie)
                            .orient("bottom");

                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate("+margin.left+"," + (height + margin.top+10) + ")")
                            .call(yAxis);

                    } else {
                        var xAxis = d3.svg.axis()
                            .scale(x)
                            .orient("bottom");

                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate("+margin.left+"," + (height + margin.top+10) + ")")
                            // .attr("transform", "translate(0,0)")
                            .call(xAxis);

                        var yAxis = d3.svg.axis()
                            .scale(serie)
                            .orient("left");

                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate("+(margin.left-10)+","+margin.top+")")
                            .call(yAxis);                        
                    }

                    //Add Bars
                    var bar = svg2.selectAll("g")
                        .data(data)
                        .enter().append("g");
                    
                    // svg.attr("transform","rotate(180 0 0)");
                    
                    if ( scope.config.bars.vertical ) {
                        bar.attr("transform", function(d, i) { return "translate(" + i * barHeight + ",0)"; });
                    } else {
                        bar.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
                    }


                    var rect = bar.append("rect")
                        .attr("fill",function(d) { return color(getValue(d)); });

                    if ( scope.config.bars.vertical ) {
                        rect.attr("y", function(d) {return x(getValue(d)); });
                        rect.attr("height", function(d) {return height - x(getValue(d)); });
                        rect.attr("width", barHeight - (barPadding*2));
                    } else {
                        rect.attr("width", function(d) {return x(getValue(d)); });
                        rect.attr("height", barHeight - (barPadding*2));    
                    }
                    
                    var text = bar.append("text")
                        .attr("fill", "black")
                        .attr("font", "8px sans-serif")
                        
                        .text(getText);
                    

                    if ( scope.config.bars.vertical ) {
                        var y = function(d,i) {return x(getValue(d)) + 15; };
                        text.attr("y", y);
                        text.attr("x", barHeight / 2 - (barPadding));
                        text.attr("dx", ".75em");
                        text.attr("text-anchor","end");
                        // text.attr("transform",function(d) {
                        //     var ypos = y(d);
                        //     var xpos = barHeight / 2 - (barPadding);
                        //     return "rotate(-90 "+xpos+" "+ypos+")";
                        // });
                    } else {
                        text.attr("x", function(d,i) {return x(getValue(d)) - 5; });
                        text.attr("y", barHeight / 2 - (barPadding));
                        text.attr("dy", ".35em");
                        text.attr("text-anchor","end");
                    }
                }
            }
        };
    });

});