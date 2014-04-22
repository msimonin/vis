      function bubbles() {
        var _width = 800;
        var _height = 600;
        var _color = function(d){return 'red'};
        var _linkDistance = 80;
        var _charge = -120;
        var _firstAfter = function(){return Math.random()*1000};
        var _every = function(){return Math.random()*3000}; 
        var _radius = function(){return 5};
        var _maxNodes = 200;
        var _burstNodes = function(){ return 1};
        var _nodes = [];

        _bubbles.nodes = function (_) {
           if (!arguments.length) return _nodes;
               _nodes = _;
           return _bubbles;
         }

         _bubbles

        _bubbles.width = function (_) {
           if (!arguments.length) return _width;
               _width = _;
           return _bubbles;
        }

        _bubbles.height = function (_) {
           if (!arguments.length) return _height;
               _height = _;
           return _bubbles;
         }

        _bubbles.color = function (_) {
           if (!arguments.length) return _color;
               _color = _ ;
           return _bubbles;
        }

        _bubbles.linkDistance = function (_) {
           if (!arguments.length) return _linkDistance;
               _linkDistance = _ ;
           return _bubbles;
        }

        _bubbles.charge = function (_) {
           if (!arguments.length) return _charge;
               _charge = _ ;
           return _bubbles;
         }

        _bubbles.firstAfter = function (_) {
           if (!arguments.length) return _firstAfter;
               _firstAfter = _ ;
           return _bubbles;
         }

        _bubbles.every = function (_) {
           if (!arguments.length) return _every;
               _every = _ ;
           return _bubbles;
         }

        _bubbles.radius = function (_) {
           if (!arguments.length) return _radius;
               _radius = _ ;
           return _bubbles;
         }

         var svg = d3.select("#slide1 #graph").append("svg")
            .attr("width", _width)
            .attr("height", _height)

        var _node = svg.selectAll(".node");

        function _bubbles() {
  
          var force = d3.layout.force()
            .size([_width, _height])
            .nodes(_nodes)
            .linkDistance(_linkDistance)
            .charge(_charge)
            .on("tick", tick);

          _restart();


           function _restart() {

            _node = _node.data(_nodes);

            _node.enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", function(d){return d.radius})
            .attr("fill", function(d) {return _color(d)})
            .attr("fill-opacity", function(d) {return Math.random() + 0.1})
            .attr("stroke", _color)
            .attr("stroke-width", "1")
            .call(force.drag);

            force.start();
          }

          function tick() {
            _node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
            var raw = n[n.length - 1];
            document.getElementById("rawtext").innerHTML = "[..." + JSON.stringify({x:Math.floor(raw.x),y:Math.floor(raw.y),radius:raw.radius,color:raw.color}) + "]";
          }

        } //restart
        return _bubbles;
      }

      function randomRadius() {
        var r = Math.floor(3*Math.random() + 2);
        if (r == 6) { r = 5;}
        return Math.floor(6*r);
      }

      function xRandom() {
        var x = Math.random();
        if (x>0.5) {
          return 100;
        }
        return 200;
      }

      function yRandom() {
        var x = Math.random();
        if (x>0.5) {
          return 100;
        }
        return 200;
      }

      var chart = bubbles().width(300).height(300)
                        .nodes([])
                        .color(function(d){return d.color})

      var n = chart.nodes();
      n.push({x:150, y:150, radius:randomRadius(), color:"red"});
      var colors = ["red", "green", "blue"];

      var pieChart = nv.models.pieChart()
        .x(function(d) {return d.key })
        .y(function(d) { return d.value })
        .color(function(d,i) {return  d.data.key})
        .width(300)
        .height(300)
        .tooltips(false)       
        .showLegend(false)
        .showLabels(true)
        .labelType("value");

      format = d3.format("d");
      var barChart = nv.models.discreteBarChart()
        .x(function(d) { return d.key })    //Specify the data accessors.
        .y(function(d) { return d.value })
        .color(["gray"])
        .width(300)
        .height(300)
        .tooltips(false)       
        .showValues(true)       
        .valueFormat(function(d){return format(d)})
        .margin({top: 20, right: 0, bottom: 0, left: 0})
        
      updateAll();
  

      setTimeout(addNode, Math.random()*1000);

      function addNode(){
        if (n.length > 29) {
          return;
        }
        var colorIndex = Math.floor(Math.random()*(colors.length));
        if (colorIndex >= colors.length) {
          colorIndex = colors.length - 1
        }
        
        n.push({x:xRandom(), y:yRandom(), radius:randomRadius(), color:colors[colorIndex]});

        updateAll();
      setTimeout(addNode, Math.random()*2000);
        
      } 

      function updateAll() {
        document.getElementById("rawtext").innerHTML = JSON.stringify(n[n.length-1]) ;

        chart.nodes(n);
        chart();
        nodesx = crossfilter(n);
        colorsDimension = nodesx.dimension(function(d){return d.color})
        colorsGroup = colorsDimension.group();

        radiusDimension = nodesx.dimension(function(d){return Math.floor(d.radius)});
        radiusGroup = radiusDimension.group();
        nvRadiusGroup = [{
          "key": "radius",
          "values": radiusGroup.all()
        }];

        d3.select("#slide1 #pie svg")
        .datum(colorsGroup.all())
        .transition().duration(700)
        .call(pieChart);

        d3.select('#slide1 #bar svg')
          .datum(nvRadiusGroup)
          .transition().duration(700)
          .call(barChart);
        }
