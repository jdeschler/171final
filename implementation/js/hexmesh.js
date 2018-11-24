/*
* Hexmesh - Object constructor function
* @param _parentElement    -- the HTML element in which to draw the visualization
* @param _data             -- the dataset
* adapted from https://bl.ocks.org/mbostock/5249328?fbclid=IwAR3mm-lVv0is1fmY7ShvWgMCJEfRAPbjfcat7H6B1rTtMLeWaWcyT2V9LHM
* For CS 171 final project
* Jack Deschler, Leyla Brittan, Michael Scott, Caroline Gutierrez
*/

HexMesh = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = this.data;
    this.initVis();
}

HexMesh.prototype.initVis = function() {
    var vis = this;

    vis.margin = {top: 0, right: 0, bottom: 0, left: 0};

    vis.width = 350 - vis.margin.left - vis.margin.right,
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    function mousedown(d) {
        mousing = d.fill ? -1 : +1;
        mousemove.apply(this, arguments);
    }

    function mousemove(d) {
        if (mousing) {
            d3.select(this).classed("fill", d.fill = mousing > 0);
        }
    }

    function mouseup() {
        mousemove.apply(this, arguments);
        mousing = 0;
    }

    function hexTopology(radius, width, height) {
        var dx = radius * 2 * Math.sin(Math.PI / 3),
            dy = radius * 1.5,
            m = Math.ceil((height + radius) / dy) + 1,
            n = Math.ceil(width / dx) + 1,
            geometries = [],
            arcs = [];

        for (var j = -1; j <= m; ++j) {
            for (var i = -1; i <= n; ++i) {
                var y = j * 2, x = (i + (j & 1) / 2) * 2;
                arcs.push([[x, y - 1], [1, 1]], [[x + 1, y], [0, 1]], [[x + 1, y + 1], [-1, 1]]);
            }
        }

        for (var j = 0, q = 3; j < m; ++j, q += 6) {
            for (var i = 0; i < n; ++i, q += 3) {
                geometries.push({
                    type: "Polygon",
                    arcs: [[q, q + 1, q + 2, ~(q + (n + 2 - (j & 1)) * 3), ~(q - 2), ~(q - (n + 2 + (j & 1)) * 3 + 2)]],
                    fill: Math.random() > i / n * 2
                });
            }
        }

        return {
            transform: {translate: [0, 0], scale: [1, 1]},
            objects: {hexagons: {type: "GeometryCollection", geometries: geometries}},
            arcs: arcs
        };
    }

    function hexProjection(radius) {
        var dx = radius * 2 * Math.sin(Math.PI / 3),
            dy = radius * 1.5;
        return {
            stream: function (stream) {
                return {
                    point: function (x, y) {
                        stream.point(x * dx / 2, (y - (2 - (y & 1)) / 3) * dy / 2);
                    },
                    lineStart: function () {
                        stream.lineStart();
                    },
                    lineEnd: function () {
                        stream.lineEnd();
                    },
                    polygonStart: function () {
                        stream.polygonStart();
                    },
                    polygonEnd: function () {
                        stream.polygonEnd();
                    }
                };
            }
        };
    }

    vis.radius = 20;

    vis.topology = hexTopology(vis.radius, vis.width, vis.height);

    let projection = hexProjection(vis.radius);

    var path = d3.geoPath()
        .projection(projection);

    vis.hexagons = []

    var counter = 0;

    vis.svg.append("g")
        .attr("class", "hexagon")
        .selectAll("path")
        .data(vis.topology.objects.hexagons.geometries)
        .enter().append("path")
        .attr("id", function(d) {counter += 1; return "hex" + (counter-1)})
        .attr("d", function(d) {
            vis.hexagons.push(d);
            return path(topojson.feature(vis.topology, d));
        })
        .on("mousedown", mousedown)
        .on("mousemove", mousemove)
        .on("mouseup", mouseup);

    vis.svg.append("path")
        .datum(topojson.mesh(vis.topology, vis.topology.objects.hexagons))
        .attr("class", "mesh")
        .attr("d", path);

    var mousing = 0;
    vis.wrangleData();
}

HexMesh.prototype.wrangleData = function() {
    var vis = this;

    vis.numHex = vis.topology.objects.hexagons.geometries.length;
    vis.beehives = vis.data.reduce(function(t,d) {return t + Number(d['2018'])}, 0)
    vis.hivesPerHex = vis.beehives/vis.numHex;
    vis.hexes = []
    for (var i = 0; i < vis.numHex; i++) {
        vis.hexes.push(i);
    }

    // from https://www.w3resource.com/javascript-exercises/javascript-array-exercise-17.php
    // its really dumb this isnt built in...
    var shuffle = function(arra1) {
        var ctr = arra1.length, temp, index;

        // While there are elements in the array
        while (ctr > 0) {
        // Pick a random index
            index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
            ctr--;
        // And swap the last element with it
            temp = arra1[ctr];
            arra1[ctr] = arra1[index];
            arra1[index] = temp;
        }
        return arra1;
    }
    vis.hexes = shuffle(vis.hexes);

    // add listener to start button
    // start update sequence on click
    //d3.select("#start-btn").on("click.hex", function() {vis.updateVis()});
}

HexMesh.prototype.updateVis = function() {
    var vis = this;

    vis.dur = 50;
    vis.hexes.forEach(function(d,i) {
        var slug = "#hex" + d;
        var hex = d3.select(slug);
        hex.transition().duration(vis.dur).delay(i*vis.dur).attr("fill", "dimgray");
    });
}

HexMesh.prototype.resetVis = function() {
    var vis = this;

    vis.hexes.forEach(function(d) {
        var slug = "#hex" + d;
        var hex = d3.select(slug);
        hex.transition().duration(4*vis.dur).attr("fill", "#FFB316");
    });
}