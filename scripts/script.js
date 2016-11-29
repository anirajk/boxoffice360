/**
 * Created by Ashwini on 11/7/2016.
 */

var height = 1000;
var width = 1500;

function bigBang(csvData) {

    var svg = d3.select('#bigbangsvg')
        .attr('height', height)
        .attr('width', width);


    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    var node = svg.select("#bigbangg")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(csvData);

    node.exit().remove();

    node = node.enter()
        .append("circle")
        .merge(node);

    node.attr("r", 5)
        .attr("fill", 'gold');

    simulation
        .nodes(csvData)
        .on('tick', function(){

            node
                .attr("cx", function(d) { return d.fx; })
                .attr("cy", function(d) { return d.fy; });
        });

}

function timeline(timelineArray, data){
    //var self = this;
    margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#timeline"); //.classed("content", true);
    svgBounds = divelectoralVotes.node().getBoundingClientRect();
    svgWidth = svgBounds.width - margin.left - margin.right;
    svgHeight = 150;

    //creates svg element within the div
    svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight);

    var xscale = d3.scaleLinear()
        .rangeRound([0,self.svgWidth])
        .domain([0,d3.sum(timelineArray, function(d){

            return 20;
        })]);



    var barsEnter = d3.select('#timeline')
        .select('svg')
        .selectAll('rect')
        .data(timelineArray);

    barsEnter.exit().remove();

    barsEnter = barsEnter.enter()
        .append('rect')
        .merge(barsEnter);

    barsEnter
        .attr('x',function(d,i){

            d.xscale = i*20;
            return i*20;
        })
        .attr('y',self.svgHeight/3)
        .attr('width', function(d){

            return xscale(20);
        })
        .attr('height', 40)
        //.attr('class', 'electoralVotes')
        .attr('fill',function(d){

            return "#45AD6A";

        });



    //Display total count of electoral votes won by the Democrat and Republican party

    var brushed = function(){

        //var data = d3.event.selection || xscale.range();

        //var y = xscale.domain(brush.empty() ? xscale.domain() : brush.extent());

        var selection = d3.event.selection || 0;//brush.extent();

        console.log(selection);

        var yearData = timelineArray.filter(function(d, i){

            //console.log(d);

            return i*20 >= selection[0] && i*20 <= selection[1];
        });

        console.log("year list");
        console.log(yearData);

       // self.shiftChart.update(data);

        var movieData = data.filter(function (d) {

            //console.log(d);
            return yearData.includes(d.title_year);

        });
        console.log("movies");
        console.log(movieData);

        bigBang(movieData);

    };

    var brush = d3.brushX().extent([[0,0],[self.svgWidth,self.svgHeight]]).on("end", brushed);


    self.svg.append("g").attr("class", "brush").call(brush);

}



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
    var yearList = [];

    csvData.forEach(function(d, i){

        d.actors = d.actor_1_name + ',' + d.actor_2_name + ',' + d.actor_3_name;
        d.fx = nodeX * i * Math.random();
        d.fy = nodeY * i * Math.random();

        if(!yearList.includes(d.title_year)) {

            yearList.push(d.title_year);
        }

    });

    //console.log(yearList);

    yearList.sort(function (a,b){

        return a-b;
    });

    timeline(yearList, csvData);
    //bigBang(csvData);

});
