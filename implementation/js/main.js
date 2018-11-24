/*
 * Jack Deschler, Leyla Brittan, Michael Scott, Caroline Gutierrez
 * CS 171 Final Project
 * To Bee or Not To Bee
 */

// load data asynchronously
queue()
    .defer(d3.json, "data/us-states.json")
    .defer(d3.csv, "data/colony-counts-transformed.csv")
    .defer(d3.csv, "data/census-regions.csv")
    .await(createVis);

function createVis(error, usData, colCounts, censusRegions) {
    if (error) { console.log(error);}

    var choropleth = new Choropleth("choropleth-area", colCounts, usData)
    let tempdata = [
        {region: "New England", val: .2},
        {region: "Mid-Atlantic", val: .3},
        {region: "East North Central", val: .1},
        {region: "West North Central", val: .5},
        {region: "South Atlantic", val: .2},
        {region: "East South Central", val: .3},
        {region: "West South Central", val: .6},
        {region: "Mountain", val: .7},
        {region: "Pacific", val: .9}
    ]

    var flower = new Flower("flower-area", colCounts, censusRegions);
    var hexmesh = new HexMesh("hexmesh-area", colCounts);
    var barchart = new BarChart("barchart-area");

    d3.select("#start-btn").on("click.hex", function() {
        hexmesh.updateVis();
        barchart.updateVis();
    });

    d3.select("#reset-btn").on("click.hex", function() {
        hexmesh.resetVis();
        barchart.resetVis();
    });
}