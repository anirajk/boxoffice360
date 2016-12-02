/**
 * Created by Ashwini on 11/7/2016.
 */

var height = window.innerHeight - 60;
var width = d3.select("#bigbang").node().getBoundingClientRect().width - 70;
var selectedMovies = [];

function bigBang(csvData, links) {


    var margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divelectoralVotes = d3.select("#bigbang"); //.classed("content", true);
    var svgBounds = divelectoralVotes.node().getBoundingClientRect();
    var svgWidth = svgBounds.width - margin.left - margin.right;
    var svgHeight = window.innerHeight - margin.top - margin.bottom - 150 ;


    var newData = new Object();
    newData.nodes = csvData;
    newData.links = links;

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    console.log(newData);


    var svg = d3.select('#bigbangsvg')
        .attr('height', svgHeight)
        .attr('width', svgWidth);


    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-200))
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(40))
        .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2))
        .on('tick',ticked);

    var link = svg.select('#bigbangg')
        .selectAll('.link');


    simulation
        .nodes(newData.nodes);
        /*.attr('title',(function(d){

            return d.movie_title ;
        }))*/




    if(links!=undefined) {
//

        simulation
            .force("link")
            .links(newData.links);

        link = link.data(newData.links);

        link.exit()
            .remove();

        link = link.enter()
            .append('line')
            .merge(link);

    }
    /*else {

        simulation
            .force("link")
            .links([0]);

        link = link.data([0]);

        link.exit()
            .remove();

        link = link.enter()
            .append('line')
            .merge(link);

    }*/

    var node = svg.select("#bigbangg")
        .attr("class", "node")
        .selectAll("circle")
        .data(newData.nodes);

    node.on('mouseover',function (d) {

            div.text(function () {

                //console.log
                if(d.tag == 'movie')
                    return d.movie_title;
                else
                    return d.actor;
            })
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px")
                .attr('opacity',0.8);
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });


    node
        .exit()
        .remove();

    node = node.enter()
        .append("circle")
        .merge(node);

    node.classed('node',true)
        .attr("r", 7)
        .attr("fill", 'gold');

    function ticked(){


        node
            .attr("cx", function(d) { return svgWidth/2; })
            .attr("cy", function(d) { return svgHeight/2; })
            .attr('opacity',0)
            .attr("cx", function(d) { return d.fx; })
            .attr("cy", function(d) { return d.fy; })
            .attr('opacity',1);

        link

            .attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });



    }

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
            var actor = [];
            actor.name = d3.select('#select').property('value');
            actor.id = movies.length;
            actor.tag = 'actor';
            actor.fx = width/2;
            actor.fy = height/2;

            var links = [];

            movies = movies.filter(function (d) {

                return d.tag == 'movie';

            });

            selectedMovies = movies.filter(function(d){

               return (d.actor_1_name == actor.name || d.actor_2_name == actor.name || d.actor_3_name == actor.name);
            });

            /*movies.forEach(function(d){

                if(d.actor_1_name == actor.name || d.actor_2_name == actor.name || d.actor_3_name == actor.name){

                    d.source = actor.id;
                    d.target = d.id;
                }

            });*/
            movies.push(actor);

            selectedMovies.forEach(function (d) {

                links.push({source: actor.id, target: d.id});
            });

            bigBang(movies,links);

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

            //d.xscale = i*widthOfRect;
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

            if(d.actor_1_name && !actors.includes(d.actor_1_name))
                actors.push(d.actor_1_name);
            if(d.actor_2_name && !actors.includes(d.actor_2_name))
                actors.push(d.actor_2_name);
            if(d.actor_3_name && !actors.includes(d.actor_3_name))
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

    d3.select('#content2')
        .attr('opacity',1)
        .transition()
        .duration(3000)
        .attr('opacity',0)
        .attr('class','hide');
    d3.select('#content1')
        .attr('opacity',0)
        .transition()
        .duration(3000)
        .attr('opacity',1)
        .attr('class','show');
    d3.select('#tab1').style('background-color','teal');
    d3.select('#tab2').style('background-color','buttonface');
});

d3.select('#tab2')
    .on('click',function(){

        d3.select('#content1')
            .attr('opacity',1)
            .transition()
            .duration(3000)
            .attr('opacity',0)
            .attr('class','hide');
        d3.select('#content2')
            .attr('opacity',0)
            .transition()
            .duration(3000)
            .attr('opacity',1)
            .attr('class','show');
        d3.select('#tab2').style('background-color','teal');
        d3.select('#tab1').style('background-color','buttonface');
});


d3.csv("data/movie_metadata.csv", function (error, csvData) {

    var nodeX = width/csvData.length;
    var nodeY = height/csvData.length;
    var yearList = [];
    var actors = [];

    csvData.forEach(function(d, i){

        //d.actors = d.actor_1_name + ',' + d.actor_2_name + ',' + d.actor_3_name;

        var x = nodeX * i * Math.random();
        var y = nodeY * i * Math.random();
        d.fx = (x < 7)? (x + 7) : x;
        d.fy = (y < 7)? (y + 7) : y;
        d.x = nodeX * i * Math.random();
        d.y = nodeY * i * Math.random();


        d.tag = 'movie';
        d.id = i;

        if(!yearList.includes(d.title_year)) {

            yearList.push(d.title_year);
        }

    });


    yearList.sort(function (a,b){

        return a-b;
    });

    timeline(yearList, csvData);


});
