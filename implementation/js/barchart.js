/*
* Barchart - Object constructor function
* @param _parentElement    -- the HTML element in which to draw the visualization
* @param _data             -- the dataset
* For CS 171 final project
* Jack Deschler, Leyla Brittan, Michael Scott, Caroline Gutierrez
*/

BarChart = function(_parentElement) {
    this.parentElement = _parentElement;
    // this.data = _data;
    // this.displayData = this.data;
    this.initVis();
}

BarChart.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 50, right: 50, bottom: 50, left: 80};

    vis.width = 700 - vis.margin.left - vis.margin.right,
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.dataset = [{type: "Fruits and Nuts", value: 10937},
        {type: "Vegetables and Melons", value: 3955.7},
        {type: "Field Crops", value: 32063.4}];

    vis.xScale = d3.scaleOrdinal()
        .domain(["", "Fruits and Nuts", "Vegetables and Melons", "Field Crops", ""])
        .range([0, vis.width/4, vis.width*2/4, vis.width*3/4, vis.width]);

    vis.yScale = d3.scaleLinear()
        .domain([0, 35000])
        .range([vis.height, 0]);

    //Define X axis
    vis.xAxis = d3.axisBottom()
        .scale(vis.xScale);

    //Define Y axis
    vis.yAxis = d3.axisLeft()
        .scale(vis.yScale)
        .ticks(5);

    vis.svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (vis.height) + ")")
        .call(vis.xAxis);

    //Create Y axis
    vis.svg.append("g")
        .attr("class", "axis")
        .call(vis.yAxis);

    // Y Axis Label
    vis.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20 - vis.margin.left)
        .attr("x",0 - (vis.height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("United States Crop Value ($ millions)");

    // Chart title
    vis.svg.append("text")
        .attr("y", 0 - (vis.margin.top/2))
        .attr("x", (vis.width / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("How Could Colony Loss Affect United States Crop Production Values?");

    // Citation
    vis.svg.append("text")
        .attr("y", vis.height + (vis.margin.bottom/2))
        .attr("x", (vis.width / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .attr("fill", "slategrey")
        .text('Simulation based on calculations provided by Morse and Calderone, "The Value of Honey Bees As Pollinators of U.S. Crops in 2000."');


    // add rects that will be dynamic
    vis.svg.selectAll("rect.rect-statick")
        .data(vis.dataset)
        .enter()
        .append("rect")
        .attr("class", "rect-static")
        .attr("x", function (d) {
            return vis.xScale(d.type);
        })
        .attr("transform", function(d) { return "translate(" + -50 + ",0)"; })
        .attr("y", function (d) {
            return vis.height - (vis.height - vis.yScale(d.value));
        })
        .attr("width", 100)
        .attr("height", function (d) {
            return vis.height - vis.yScale(d.value);
        })
        .attr("fill", "dimgray")
        .attr("stroke", "#FFB316")
        .attr("stroke-width", "3");

    // add rects that will be dynamic
    vis.svg.selectAll("rect.rect-dynamic")
        .data(vis.dataset)
        .enter()
        .append("rect")
        .attr("class", "rect-dynamic")
        .attr("x", function (d) {
            return vis.xScale(d.type);
        })
        .attr("transform", function(d) { return "translate(" + -50 + ",0)"; })
        .attr("y", function (d) {
            return vis.height - (vis.height - vis.yScale(d.value));
        })
        .attr("width", 100)
        .attr("height", function (d) {
            return vis.height - vis.yScale(d.value);
        })
        .attr("fill", "#FFB316");

    vis.wrangleData();
}


BarChart.prototype.wrangleData = function() {
    var vis = this;

    // add listener to start button
    // start update sequence on click
    // d3.select("#start-btn").on("click.bar", function() {vis.updateVis()});
}

BarChart.prototype.updateVis = function() {
    var vis = this;

    vis.dataset = [{type: "Fruits and Nuts", value: 6174.5},
        {type: "Vegetables and Melons", value: 971.8},
        {type: "Field Crops", value: 25246.7}];

    vis.svg.selectAll("rect.rect-dynamic")
        .data(vis.dataset)
        .transition()
        .duration(9430)
        .ease(d3.easeLinear)
        .attr("height", function(d) {
            return vis.height - vis.yScale(d.value);
        })
        .attr("y", function(d) {
            return vis.height - (vis.height - vis.yScale(d.value));
        });


}

BarChart.prototype.resetVis = function() {

    var vis = this;

    vis.dataset = [{type: "Fruits and Nuts", value: 10937},
        {type: "Vegetables and Melons", value: 3955.7},
        {type: "Field Crops", value: 32063.4}];

    vis.svg.selectAll("rect.rect-dynamic")
        .data(vis.dataset)
        .transition()
        .duration(500)
        .attr("y", function(d) {
            return vis.height - (vis.height - vis.yScale(d.value));
        })
        .attr("height", function(d) {
            return vis.height - vis.yScale(d.value);
        });

}