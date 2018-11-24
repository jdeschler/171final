/*
 * Initialize bar chart
 */

// Draw SVG area
var margin = {top: 20, bottom: 20, right: 50, left: 60};

var width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("#neonic-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
    .attr("align", "center");

// Scales
var x = d3.scaleBand()
    .range([margin.left, width - margin.right])
    .paddingInner(0.2);

var y = d3.scaleLinear()
    .range([height, 0]);

// Axis
var xAxis = d3.axisBottom()
    .scale(x);

var yAxis = d3.axisLeft()
    .scale(y);

var xAxisGroup = svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")");

var yAxisGroup = svg.append("g")
    .attr("class", "y-axis axis")
    .attr("transform", "translate(" + margin.left + ", 0)");

prepareData();

function prepareData() {
    d3.csv("data/honey_neonic_use.csv", function(error, csv) {

        // Nest data by year, summing total neonicotinoid usage
        var dataNested = d3.nest()
            .key(function(d) { return d.year; })
            .rollup(function(d) {
                return d3.sum(d, function(group) { return group.nAllNeonic; })
            }).entries(csv);

        // Clean data
        dataNested.forEach(function(d) {
            d.key = +d.key;
            d.value = Math.round(d.value);
        });

        // Sort data by year
        dataNested.sort(function(a, b) {
            return a.key - b.key;
        });

        // Call drawing function
        drawBarChart(dataNested);
    });
}

function drawBarChart(data) {
    // Update scales of visualization
    x.domain(data.map(function(d) { return d.key; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    // Draw bars
    var bars = svg.selectAll(".bar")
        .data(data);

    bars.enter().append("rect")
        .attr("height", 0)
        .attr("y", height)
        .attr("class", "neonic-bar")
        .merge(bars)
        .attr("x", function(d) { return x(d.key); })
        .attr("y", function(d) { return (y(d.value) - margin.bottom); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return (height - y(d.value)); })
        .attr("style", "fill: goldenrod");

    bars.exit().remove();

    // Draw axes
    xAxisGroup = svg.select(".x-axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(xAxis);

    yAxisGroup = svg.select(".y-axis")
        .attr("transform", "translate(" + margin.left + ", 0)")
        .call(yAxis);

    // Chart title and subtitle
    svg.append("text")
        .attr("class", "chart-title")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width / 3) + "," + margin.top + ")")
        .attr("y", 0)
        .attr("x", 0)
        .text("Neonicotinoid Usage in the U.S., 1991-2017");

    svg.append("text")
        .attr("class", "chart-subtitle")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width / 3) + "," + (margin.top + 20) + ")")
        .attr("y", 0)
        .attr("x", 0)
        .text("Kilograms per Year");
}