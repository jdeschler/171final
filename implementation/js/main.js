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

// Update info box to user's selection
function updateInfo(selection) {
    var text;
    var subtitle;
    switch(selection) {
        case "pesticides":
            text = "Usage of a certain class of pesticides known as neonicotinoids has been linked to Colony Collapse Disorder. Honeybees have been observed to have" +
                " decreased memory and foraging capabilities when subjected to these chemicals in a laboratory setting, and neonicotinoids saw significant use in many staple crops such" +
                " as corn beginning in the early 2000's. While results are not conclusive, many policymakers and scientists alike point to neonicotinoids as a likely contributor to CCD and various governments" +
                " have sought to limit or ban the usage of the substances in the past few years.";
            subtitle = "Pesticides";
            break;
        case "pests":
            text = "The growing prevalence of honeybee pests, especially the varroa mite, is suspected to contribute to colony loss as a whole and potentially CCD itself. In recent years" +
                " bee colonies have been under assault by not only these mites but various other bee parasites and diseases, ranging from beetles and wax moths to fungal and bacterial infections." +
                " Many of these afflictions are not new and have existed long before the onset of CCD, but resistance to treatment has made some of them harder to deal with and may be compounding" +
                " the issue. ";
            subtitle = "Pests";
            break;
        case "climate":
            text = "Some cite climate change as a potential culprit for CCD. Climate has direct effects on both bee behavior and their main food source, flowers. Extreme weather events can severely hamper" +
                " foraging efforts as bees combat flooding due to rain and extreme heat, as well as more individual effects like reduced flight ability. More subtle, " +
                " gradual changes in climate can result in changing growth and flowering periods of many crops that bees frequent for sustenance." +
                " The effects of climate change are however difficult to measure in the time that CCD has become prevalent, and thus more effort has been going towards exploring causes" +
                " like pesticide usage.";
            subtitle = "Climate Change";
            break;
        case "humans":
            text = "In addition to pesticide usage, other human behaviors may be contributing to the decline of honeybee populations. Among human-managed hives, the close proximity of different colonies as well" +
                " as the practice of migratory beekeeping, the practice of moving beehives for various purposes such as pollination, may be contributing to the spread of diseases and pests. Travelling bees have" +
                " been shown to have greater stress levels and shorter lifespans than stationary bees, and the constant need to adapt to new environments can reduce bee's ability to navigate well as they must" +
                " constantly re-learn where their hive is with respect to various resources like flowers and water sources.";
            subtitle = "Human behavior";
            break;
    }
    document.getElementById("ccd-cause-info").innerHTML = "<h4>" + subtitle + "</h4>" + "<p>" + text + "</p>";
}