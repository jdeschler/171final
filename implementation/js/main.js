/*
 * Jack Deschler, Leyla Brittan, Michael Scott, Caroline Gutierrez
 * CS 171 Final Project
 * To Bee or Not To Bee
 */

// load data asynchronously
queue()
    .defer(d3.json, "data/us-states.json")
    .defer(d3.csv, "data/colony-counts-transformed.csv")
    .await(createVis)

function createVis(error, usData, colCounts) {
    if (error) { console.log(error);}

    var choropleth = new Choropleth("choropleth-area", colCounts, usData)
    var flower = new Flower("flower-area", [])
}