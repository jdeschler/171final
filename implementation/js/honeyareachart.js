
//Code adapted from Lab 6
//To format values and time objects
//comma formating from http://bl.ocks.org/mstanaland/6106487
var commas = d3.format(",");
var formatDate = d3.timeFormat("%Y");
var formatLbs = d3.format(".2s");

AreaChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];
    this.initVis();
}


AreaChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 40, right: 10, bottom: 60, left: 70};

    vis.width = 800 - vis.margin.left - vis.margin.right,
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.x = d3.scaleTime()
        .range([0, vis.width])
        .domain(d3.extent(vis.data, function(d) { return d.Year; }));

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y)
        .tickFormat(function(d) { return formatLbs(d)});;

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    vis.area = d3.area()
        .x(function(d) { return vis.x(d.Year); })
        .y0(vis.height)
        .y1(function(d) { return vis.y(d.Value); });

// code for tooltip from http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
   vis.div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


//code for valueline https://bl.ocks.org/d3noob/119a138ef9bd1d8f0a8d57ea72355252
    vis.valueline = d3.line()
        .x(function(d){ return vis.x(d.Year); })
        .y(function(d) { return vis.y(d.Value); });

    vis.wrangleData();

}

AreaChart.prototype.wrangleData = function(){
    var vis = this;

    vis.updateVis();
}

AreaChart.prototype.updateVis = function(){
    var vis = this;

    vis.y.domain([0, d3.max(vis.data, function(d) {
        return d.Value
    })]);

    var area_body = vis.svg.selectAll(".area")
        .data([vis.data]);

    area_body.enter().append("path")
        .attr("class", "area")
        .merge(area_body)
        .attr("fill","#FFB316")
        .attr("d", vis.area);

    area_body.exit().remove();

var dot = vis.svg.selectAll("circle")
        .data(vis.data)
        .attr("clip-path", "url(#clip)");
//code for scatterplot partially from http://bl.ocks.org/d3noob/38744a17f9c0141bcd04
    dot.enter().append("circle")
        .attr("class", "dot")
        .merge(dot)
        .attr("r", 4)
        .attr("cx", function(d) { return vis.x(d.Year); })
        .attr("cy", function(d) { return vis.y(d.Value); })
        // code for tooltip from http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
        .on("mouseover", function(d) {
            vis.div.transition()
                .duration(200)
                .style("opacity", .9);
            vis.div	.html("Year: " + formatDate(d.Year) + "<br/>"+ " lbs: " + commas(d.Value))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            vis.div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    var line = vis.svg.selectAll(".line")
        .data([vis.data])
        .attr("clip-path", "url(#clip)");

    line.enter().append("path")
        .attr("class", "line")
        .merge(line)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .attr("d", vis.valueline);
    line.exit().remove();

//code for clip path from https://bl.ocks.org/mbostock/4015254
    var areaPath = vis.svg.append("path")
        .attr("clip-path", "url(#clip)");

    vis.svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width+10)
        .attr("height", vis.height);
//code for labeling axis from https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
    vis.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - vis.margin.left +10)
        .attr("x",0 - (vis.height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("lbs");

    // Call axis functions with the new domain
    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);
}


