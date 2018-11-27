/*
 * Choropleth - Object constructor function
 * @param _parentElement    -- the HTML element in which to draw the visualization
 * @param _data             -- the dataset
 */

Choropleth = function(_parentElement, _data, _topodata) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.topodata = _topodata;

    this.displayData = this.data;

    this.initVis();
}

/*
 * Initialize the choropleth
 */
Choropleth.prototype.initVis = function() {
    var vis = this;
    vis.margin = {top: 0, right: 0, bottom: 30, left: 60};

    vis.width = 600 - vis.margin.left - vis.margin.right,
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.projection = d3.geoAlbersUsa().translate([vis.width/2, vis.height/2]).scale(600);
    vis.path = d3.geoPath().projection(vis.projection);
    vis.mapData = vis.topodata.features;

    // tooltips
    vis.tip = d3.tip();


    // update tooltips
    vis.tip
        .attr("class", "d3-tip")
        .offset([5,0]);

    vis.svg.call(vis.tip);

    vis.colorScale = d3.scaleQuantize();

    vis.wrangleData();
}

/*
 * Wrangle the Data
 */
Choropleth.prototype.wrangleData = function() {
    var vis = this;

    // get values from selectbox
    vis.yearmin = d3.select("#start-year").property("value");
    vis.yearmax = d3.select("#end-year").property("value");

    if (vis.yearmin >= vis.yearmax) {
        vis.svg.append("text").attr("fill", "firebrick")
            .attr("y", 20)
            .text("Please select a valid range of years.")
        return;
    }

    // make displayData
    var agg = {}
    var acc = []
    vis.data.forEach(function(d){
        var nmin = Number(d[vis.yearmin]);
        var nmax = Number(d[vis.yearmax]);
        agg[d.State] = (nmax - nmin)/nmin;
        acc.push((nmax - nmin)/nmin)
    });
    vis.displayData = agg;

    // change colorScale
    vis.colors = ["#E8FF64", "#E8C808", "#FFB316", "#E86B08", "#FF3409"];
    vis.colorScale.domain([-1, 0])
        .range(vis.colors.reverse());

    // Update the visualization
    vis.updateVis();
}

/*
 * Draw the choropleth when it gets updated
 */
Choropleth.prototype.updateVis = function(){
    var vis = this;

    d3.select("#start-year").on("change.choropleth", function() {vis.wrangleData()});
    d3.select("#end-year").on("change.choropleth", function() {vis.wrangleData()});

    vis.tip.html(function(d) {
        var state = d.properties.name;
        var val = vis.displayData[state];
        var acc = "<span class='tip-label'>" +
            state + ": ";
        if (!val)
            acc += "<i>No Data Available</i>";
        else if (val > 0)
            acc += "<i>No loss</i>"
        else
            acc += d3.format(".2%")(val)
        return acc;
    });

    // update colors
    var countries = vis.svg
        .selectAll("path")
        .data(vis.mapData);

    countries
        .enter().append("path")
        .on("mouseover", vis.tip.show)
        .on("mouseout", vis.tip.hide)
        .merge(countries)
        .transition()
        .duration(500)
        .attr("d", vis.path)
        .attr("fill", function(d) {
            var state = d.properties.name;
            var val = vis.displayData[state];
            if (!val)
                return "lightgray";
            if (val > 0)
                return vis.colorScale(0);
            return vis.colorScale(val);
        });

    // add legend, adapted from http://bl.ocks.org/KoGor/5685876
    var legend = vis.svg.selectAll("g.legend")
        .data(vis.colors.reverse())
        .enter().append("g")
        .attr("class", "legend");

    let legend_labels = ["No loss", "20% loss", "40% loss", "60% loss", "80% loss", "100% loss"]


    let ls_w = 20, ls_h = 20;


    legend.append("rect")
        .attr("x", vis.width-100)
        .attr("y", function(d, i){ return vis.height - (i*ls_h) - 2*ls_h;})
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d,i) { return vis.colors[i]; })
        .style("opacity", 0.8);

    legend.selectAll("text")
        .data(legend_labels)
        .enter()
        .append("text")
        .attr("x", vis.width-75)
        .attr("font-size", 12)
        .attr("y", function(d, i){ return vis.height - (i*ls_h) - .5*ls_h - 4;})
        .text(function(d, i){ return legend_labels[i]; });

    // append random extra bits
    legend.append("text")
        .attr("alignment-baseline", "top")
        .attr("x", vis.width - 100)
        .attr("y", vis.height - ((legend_labels.length+.5)*ls_h))
        .text("Colony loss:");
}