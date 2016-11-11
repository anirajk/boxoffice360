/**
 * Created by Ashwini on 11/7/2016.
 */

var height = 1000;
var width = 1500;

d3.select('#tab1')
.on('click',function(){

    d3.select('#content2').attr('class','hide');
    d3.select('#content1').attr('class','show');
    d3.select('#tab1').style('background-color','teal');
    d3.select('#tab2').style('background-color','buttonface');
});

d3.select('#tab2')
    .on('click',function(){

        d3.select('#content1').attr('class','hide');
        d3.select('#content2').attr('class','show');
        d3.select('#tab2').style('background-color','teal');
        d3.select('#tab1').style('background-color','buttonface');
});

d3.csv("data/movie_metadata.csv", function (error, csvData) {

    var nodeX = width/5000;
    var nodeY = height/5000;
    var yearList;

    csvData.forEach(function(d, i){

        d.actors = d.actor_1_name + ',' + d.actor_2_name + ',' + d.actor_3_name;
        d.x = nodeX * i * Math.random();
        d.y = nodeY * i * Math.random();

        console.log(d);
    });

    var svg = d3.select('#bigbang')
        .append('svg')
        .attr('height', height)
        .attr('width', width);


    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(csvData)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", 'gold');

    simulation
        .nodes(csvData)
        .on('tick', function(){

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });
});
