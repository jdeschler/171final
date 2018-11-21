/*
 * Flower Radial Chart for CS 171 final project
 * adapted from http://bl.ocks.org/herrstucki/6199768?fbclid=IwAR1Gc-Bpk-GBaSM4Y13jViCO7h7CuudiYm9pc4Nk3WfMfr6o5NQvHjwRoDs
 */

Flower = function(_parentElement, _data, _censusdata) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.censusdata = _censusdata;
    console.log(this.censusdata);

    this.displayData = this.data;

    this.initVis();
}

Flower.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 0, right: 0, bottom: 30, left: 0};

    vis.width = 300 - vis.margin.left - vis.margin.right,
        vis.height = 600 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.rad = vis.width/4;

    vis.petalSize = d3.scaleSqrt()
        .domain([0, 1])
        .range([0, vis.rad]);

    vis.pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.val; });

    // process censusRegions into useful format
    var tempCensus = {}
    vis.censusdata.forEach(function(d) {
        tempCensus[d.State] = d.Division;
    })
    vis.censusdata = tempCensus;

    vis.wrangleData();
}

Flower.prototype.wrangleData = function() {
    var vis = this;

    // TODO make this work
    
    vis.displayData = vis.data;
    vis.updateVis();
}

Flower.prototype.updateVis = function() {
    var vis = this;

    var flower = vis.svg
        .append('g')
        .attr("class", "flower")
        .attr("transform", "translate("+ (vis.rad*2) +"," + (vis.height/2 - vis.rad) + ")");

    function petalPath(d) {
        var angle = (d.endAngle - d.startAngle) / 2,
            s = polarToCartesian(-angle, vis.rad),
            e = polarToCartesian(angle, vis.rad),
            r = vis.petalSize(d.data.val),
            m = {x: vis.rad + r, y: 0},
            c1 = {x: (vis.rad) + r/2, y: s.y},
            c2 = {x: (vis.rad) + r/2, y: e.y};
        return "M0,0L" + s.x + "," + s.y + "Q" + c1.x + "," + c1.y + " " + m.x + "," + m.y + "L" + m.x + "," + m.y + "Q" + c2.x + "," + c2.y + " " + e.x + "," + e.y + "Z";
    };

    function petalFill(d, i) {
        return d3.hcl(i / vis.displayData.length * 360, 60, 70);
    };

    function petalStroke(d, i) {
        return d3.hcl(i / vis.displayData.length * 360, 60, 40);
    };

    function r(angle) {
        return "rotate(" + (angle / Math.PI * 180) + ")";
    }

    function rrev(angle) {
        return "rotate(" + (-angle / Math.PI * 180) + ")"
    }

    function polarToCartesian(angle, radius) {
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        };
    };

    var petal = flower.selectAll(".petal")
        .data(vis.pie(vis.displayData))
        .enter().append("path")
        .attr("class", "petal")
        .attr("transform", function(d) { return rrev((d.startAngle + d.endAngle) / 2); })
        .attr("d", petalPath)
        .style("stroke", petalStroke)
        .style("fill", petalFill);
}
