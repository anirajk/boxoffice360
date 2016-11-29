/**
 * Created by Ashwini on 11/7/2016.
 */

var height = 1000;
var width = 1500;

function bigBang(csvData) {


    var margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divelectoralVotes = d3.select("#bigbang"); //.classed("content", true);
    var svgBounds = divelectoralVotes.node().getBoundingClientRect();
    var svgWidth = svgBounds.width - margin.left - margin.right;
    var svgHeight = window.innerHeight - margin.top - margin.bottom - 150 ;


    var svg = d3.select('#bigbangsvg')
        .attr('height', svgHeight)
        .attr('width', svgWidth);


    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2));

    var node = svg.select("#bigbangg")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(csvData);

    node.exit()
        .remove();

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

function selectBoxFlooding(movies,actors) {

    var list = d3.select('#select')
        .selectAll('option')
        .data(actors);

    list.exit()
        .remove();

    list = list.enter()
        .append('option')
        .merge(list);

    list.attr('value',(function(d) {

        return d;

        }))
        .text(function(d){

            return d;
        });

    d3.select('#select')
        .on('change',function(d){

            //console.log(d3.select('#select').property('value'));
            var actor = d3.select('#select').property('value');

            var nodes = movies.filter(function(d){

               return (d.actor_1_name == actor || d.actor_2_name == actor || d.actor_3_name == actor);
            });

        });

}

function timeline(timelineArray, data){
    //var self = this;
    var margin = {top: 30, right: 20, bottom: 30, left: 50};
    var actors = [];

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#timeline"); //.classed("content", true);
    var svgBounds = divelectoralVotes.node().getBoundingClientRect();
    var svgWidth = svgBounds.width - margin.left - margin.right;
    var svgHeight = 150;

    var widthOfRect = svgWidth/(timelineArray.length);

    //creates svg element within the div
    var svg = divelectoralVotes.append("svg")
        .attr("width",svgWidth)
        .attr("height",svgHeight);

    var xscale = d3.scaleLinear()
        .rangeRound([0,svgWidth])
        .domain([0,d3.sum(timelineArray, function(d){

            return widthOfRect;
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

            d.xscale = i*widthOfRect;
            return i*widthOfRect;
        })
        .attr('y',svgHeight/3)
        .attr('width', function(d){

            return xscale(widthOfRect);
        })
        .attr('height', 40)
        //.attr('class', 'electoralVotes')
        .attr('fill',function(d){

            return "#45AD6A";

        });


    var brushed = function(){

        var selection = d3.event.selection || 0;//brush.extent();

        var yearData = timelineArray.filter(function(d, i){

            //console.log(d);

            return i*widthOfRect >= selection[0] && i*widthOfRect <= selection[1];
        });


        var movieData = data.filter(function (d) {

            return yearData.includes(d.title_year);

        });

        var actors = [];

        movieData.forEach(function(d){

            actors.push(d.actor_1_name);
            actors.push(d.actor_2_name);
            actors.push(d.actor_3_name);
        });

        //update the select box and the nodes in the force field
        selectBoxFlooding(movieData, actors);
        bigBang(movieData);

    };

    var brush = d3.brushX().extent([[0,0],[svgWidth,svgHeight]]).on("end", brushed);


    svg.append("g").attr("class", "brush").call(brush);

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
    var actors = [];

    csvData.forEach(function(d, i){

        //d.actors = d.actor_1_name + ',' + d.actor_2_name + ',' + d.actor_3_name;
        d.fx = nodeX * i * Math.random();
        d.fy = nodeY * i * Math.random();

        if(!yearList.includes(d.title_year)) {

            yearList.push(d.title_year);
        }

    });

    yearList.sort(function (a,b){

        return a-b;
    });

    timeline(yearList, csvData);


});
