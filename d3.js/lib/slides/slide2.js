var fluctuationChart = dc.barChart("#fluctuation-chart");
var imagesChart = dc.rowChart("#images-chart");
var sitesChart = dc.pieChart("#sites-chart");

var datax = crossfilter(bonfire_datas);
var all = datax.groupAll();

/* Diff time chart. */
var dataByDiff = datax.dimension(function(d){return Math.floor(d.diff)})
var inriaDiffGroup = dataByDiff.group().reduceSum(function(d){return d.site=="fr-inria"?1:0});
var hpDiffGroup = dataByDiff.group().reduceSum(function(d){return d.site=="uk-hplabs"?1:0});
var epDiffGroup = dataByDiff.group().reduceSum(function(d){return d.site=="uk-epcc"?1:0});

 fluctuationChart.width(400)
   .height(300)
   .dimension(dataByDiff)
   .group(inriaDiffGroup)
   .stack(hpDiffGroup)
   .stack(epDiffGroup)
   .ordinalColors(["orange", "green", "blue"]) 
   .centerBar(true)
   .gap(1)
   .elasticY(true)
   .round(dc.round.floor)
   .x(d3.scale.linear().domain([0, 100]))
   .renderHorizontalGridLines(true)
   .xAxisLabel("Time (s)")
   .yAxisLabel("# VMs")

fluctuationChart.xAxis()
fluctuationChart.yAxis().ticks(5);

/* Images name Chart. */
var images = datax.dimension(function (d) {
  return d.image_name;
});
var imagesGroup = images.group();

imagesChart.width(500)
  .height(100)
  .margins({top: 20, left: 10, right: 10, bottom: 20})
  .dimension(images)
  .group(imagesGroup)
  .ordinalColors(['red', 'pink'])
  .label(function(d){
      return d.key
  })
  .title(function(d){
    d.value
  })
  .xAxis().ticks(4);

/* Sites chart*/
var sites = datax.dimension(function (d) {
  return d.site;
});
var sitesGroup = sites.group();

sitesChart.width(180) 
  .height(180) 
  .radius(80) 
  .dimension(sites)
  .ordinalColors(["orange", "blue", "green"]) 
  .group(sitesGroup) 
  .innerRadius(40)
  .transitionDuration(200);

dc.renderAll();
