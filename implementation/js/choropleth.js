/*
 * Choropleth - Object constructor function
 * @param _parentElement    -- the HTML element in which to draw the visualization
 * @param _data             -- the dataset
 */

Choropleth = function(_parentElement, _data, _topodata) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.topodata = _topodata;

    // No data wrangling, no update sequence
    this.displayData = this.data;

    this.initVis();
}

/*
 * Initialize the choropleth
 */
Choropleth.prototype.initVis = function() {
    var vis = this;
    vis.margin = {top: 0, right: 0, bottom: 30, left: 60};

    vis.width = 840 - vis.margin.left - vis.margin.right,
        vis.height = 800 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.projection = d3.geoAlbersUsa().translate([vis.width/2, vis.height/2]);
    vis.path = d3.geoPath().projection(vis.projection);
    console.log(vis.topodata)
    vis.mapData = vis.topodata.features;

    // tooltips
    vis.tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([5,0]);

    vis.svg.call(vis.tip);

    vis.wrangleData();
}

/*
 * Wrangle the Data
 */
Choropleth.prototype.wrangleData = function() {
    var vis = this;

    // get values from selectbox TODO
    var yearmin = 1996;
    var yearmax = 2003;

    // make displayData
    var agg = {}
    var acc = []
    vis.data.forEach(function(d){
        var nmin = Number(d[yearmin]);
        var nmax = Number(d[yearmax]);
        agg[d.State] = (nmax - nmin)/nmin;
        acc.push((nmax - nmin)/nmin)
    });
    vis.displayData = agg;

    // change colorScale
    vis.colorScale = d3.scaleLinear()
        .domain([d3.min(acc), 0, d3.max(acc)])
        .range(['red', 'white', 'green']);
    console.log(vis.colorScale.domain())

    // Update the visualization
    vis.updateVis();
}

/*
 * Draw the choropleth when it gets updated
 */
Choropleth.prototype.updateVis = function(){
    var vis = this;

    // update tooltips
    vis.tip.html(function(d) {
        var state = d.properties.name;
        var val = vis.displayData[state];
        var acc = "<span class=tip-label>" +
            state + ": ";
        if (!val)
            acc += "<i>No Data Available</i>"
        else
            acc += d3.format("%")(val)
        return acc;
    })

    // update colors
    vis.svg
        .selectAll("path")
        .data(vis.mapData)
        .enter().append("path")
        .attr("d", vis.path)
        .attr("fill", function(d) {
            var state = d.properties.name;
            var val = vis.displayData[state];
            if (!val)
                return "lightgray";
            return vis.colorScale(val);
        })
        .on("mouseover", vis.tip.show)
        .on("mouseout", vis.tip.hide);
}