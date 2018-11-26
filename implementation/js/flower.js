/*
 * Flower Radial Chart for CS 171 final project
 * adapted from http://bl.ocks.org/herrstucki/6199768?fbclid=IwAR1Gc-Bpk-GBaSM4Y13jViCO7h7CuudiYm9pc4Nk3WfMfr6o5NQvHjwRoDs
 */

Flower = function(_parentElement, _data, _censusdata) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.censusdata = _censusdata;

    this.displayData = this.data;

    this.initVis();
}

Flower.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 150, right: 0, bottom: 30, left: 0};

    vis.width = 300 - vis.margin.left - vis.margin.right,
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.rad = vis.width/4;

    // must declare this here so we can wipe it later
    vis.flower = vis.svg
        .append('g')
        .attr("class", "flower")
        .attr("transform", "translate("+ (vis.rad*2) +"," + (vis.height/2 - vis.rad) + ")");

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

    // tooltips - tipbox
    vis.tipbox = vis.svg
        .append("text").attr("class", "tipbox")
        .attr("x", vis.width/2).attr("y", vis.height/2 + .8 * vis.rad)
        .attr("text-anchor", "middle").text("");


    vis.wrangleData();
}

Flower.prototype.wrangleData = function() {
    var vis = this;

    // get values from selectbox
    vis.yearmin = d3.select("#start-year").property("value");
    vis.yearmax = d3.select("#end-year").property("value");
    vis.displayData = {};

    vis.data.forEach(function(d) {
       var value = d[vis.yearmin] - d[vis.yearmax];
       var region = vis.censusdata[d.State];
       if (!vis.displayData[region]) {
           var temp = {};
           temp['region'] = region;
           temp['num'] = 0;
           vis.displayData[region] = temp;
       }
       vis.displayData[region].num += value;
    });
    delete vis.displayData['undefined'];

    // get data ready to be visualized
    let copy = vis.displayData;
    var tot = 0;
    vis.displayData = [];
    Object.keys(copy).forEach(function(t) {
        if (copy[t].num > 0) {
            vis.displayData.push(copy[t])
            tot += copy[t].num;
        }
        else
            vis.displayData.push({'region': copy[t].region, 'num': 0})
    });

    // change to percentages
    vis.displayData.forEach(function(d) { d.val = d.num/tot;});

    vis.updateVis();
}

Flower.prototype.updateVis = function() {
    var vis = this;

    vis.flower.selectAll("*")
        .transition()
        .duration(600)
        .style("opacity", 0)
        .remove();

    // selectbox listeners
    d3.select("#start-year").on("change.flower", function() {vis.wrangleData()});
    d3.select("#end-year").on("change.flower", function() {vis.wrangleData()});

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

    function polarToCartesian(angle, radius) {
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        };
    };

    // tipbox update functions
    function showTipbox(d) {
        vis.tipbox.text(d.data.region + ": " + d.data.num + " colonies lost")
    }

    function hideTipbox() {
        vis.tipbox.text("");
    }

    // draw everything now that we have the functions set up
    var petal_group = vis.flower.selectAll(".petal")
        .data(vis.pie(vis.displayData), function(d) {return d.region});

    var petals = petal_group.enter().append("path");

    petals.merge(petal_group)
        .attr("class", "petal")
        .on("mouseover", function(d) {showTipbox(d)})
        .on("mouseout", hideTipbox())
        .attr("transform", function(d) { return r((d.startAngle + d.endAngle) / 2); })
        .style("fill", petalFill)
        .attr("d", petalPath)
        .style("stroke", petalStroke)
        .style("opacity", 0)
        .transition()
        .duration(500)
        .style("opacity", 1);

    petals.exit().remove();
}
