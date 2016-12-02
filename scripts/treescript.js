/**
 * Created by ashwini on 02-Dec-16.
 */


var height = window.innerHeight - 60;
var width = d3.select("#bigbang").node().getBoundingClientRect().width - 70;
var selectedMovies = [];
var force =  new Object();
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function bigBang(forces) {


    var margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divelectoralVotes = d3.select("#bigbang"); //.classed("content", true);
    var svgBounds = divelectoralVotes.node().getBoundingClientRect();
    var svgWidth = svgBounds.width - margin.left - margin.right;
    var svgHeight = window.innerHeight - margin.top - margin.bottom - 150 ;





    var svg = d3.select('#bigbangsvg')
        .attr('height', svgHeight)
        .attr('width', svgWidth);




        var simulation = d3.forceSimulation()
            .force("charge", d3.forceManyBody().distanceMin(15).distanceMax(60))
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }).distance(35))
            .force("center", d3.forceCenter(svgWidth / 2, svgHeight /2  ))
            .on('tick', ticked);

        var link = svg.select('#bigbangg')
            .selectAll('.link');


        simulation
            .nodes(forces.nodes);

        simulation
            .force("link")
            .links(forces.links);

        link =  link.data(forces.links);

        link.exit()
            .remove();

        link =  link.enter()
            .append('line')
            .merge( link)
            .attr('class', 'link');


        var node = svg.select("#bigbangg")
            .selectAll("circle")
            .data(forces.nodes);


        node
            .exit()
            .remove();

        node = node.enter()
            .append("circle")
            .merge(node)
            .attr("class", function (d) {

                if (d.tag == 'actor')
                    return 'actor';
                return 'node';
            });

        node.on('mouseover', function (d) {

            div.text(function () {


                if (d.tag == 'movie')
                    return d.movie_title;
                return d.name;
            })
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY-20) + "px")
                .style('opacity', 0.9);
        })
            .on("mouseout", function () {
                div.style("opacity", 0);
            });

        node.classed('node', true)
            .attr("r", function(d){

                if(d.tag == 'movie')
                    return 12;
                return 7;
            })
            .attr("fill", 'gold');

        function ticked() {


            node

                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .style('opacity', 1)
                ;

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
                })
                .style('opacity', 1);



        }
    //});

}



function selectBoxFlooding(movies,actors) {

    //actor

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
        .on('change',function(d) {

            var actor = new Object();
            actor.name = d3.select('#select').property('value').toString();
            //actor.id = ;
            actor.tag = 'actor';


            for (var i = 0; i < force.nodes.length; i++) {

                if (force.nodes[i].tag == 'actor') {

                    if (force.nodes[i].name.toLowerCase() == actor.name.toLowerCase())
                        actor.id = force.nodes[i].id;
                }
            }

            console.log(actor.id);


            var movies = force.nodes.filter(function (d) {

                d.x = 0;
                d.y = 0;

                return (d.actor_1_name == actor.name || d.actor_2_name == actor.name || d.actor_3_name == actor.name);
            });

            movies.push(actor);

            var links = [];

            force.links.forEach(function(d){

                if(d.target.id == actor.id) {

                    var linkobj = new Object();
                    linkobj.source = actor.id;
                    linkobj.target = d.source.id;
                    links.push(linkobj);
                }
            });

            var forces = new Object();
            forces.nodes = movies;
            forces.links = links;

            console.log(forces);

            bigBang(forces);

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

    var widthOfRect = svgWidth /(timelineArray.length);

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
        .on('mouseover',function (d) {


            div.text(function () {

                return d;
            })
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY-20) + "px")
                .style('opacity', 0.9);

        })
        .on('mouseout',function(d){

            div.style('opacity',0);
        })
        .attr('x',function(d,i){

            //d.xscale = i*widthOfRect;

                return i*widthOfRect;

        })
        .attr('y',svgHeight/3)
        .attr('width', function(d){

            return xscale(widthOfRect) * 0.9;
        })
        .attr('height', 40)
        //.attr('class', 'electoralVotes')
        .attr('fill',function(d){

            return "#45AD6A";

        })
        .on('click',function (d) {

            console.log(d);

            brushed(d);
        });

    function brushed(year){


        var movieData = data.filter(function (d) {

            return year == d.title_year;

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




        function forces(){

            //var force = new Object();


            var links = [];

            var new_actors = actors;

            new_actors.forEach(function(d, i) {


                var actorObject = new Object();
                actorObject.name = d;
                actorObject.tag = 'actor';
                actorObject.id = movieData.length + i;

                movieData.push(actorObject);

                movieData.forEach(function (e , f) {

                    //var movie = new Object();

                    if((e.tag == 'movie') && (d == e.actor_1_name || d == e.actor_2_name || d == e.actor_3_name)) {

                            var link = new Object();

                            e.id = f;
                            link.target = actorObject.id;
                            link.source = e.id;
                            links.push(link);


                    }

                });


            });



            force.nodes = movieData;
            force.links = links;


            //console.log(force);


        }
        //update the select box and the nodes in the force field
        selectBoxFlooding(movieData, actors);
        forces();
        bigBang(force);

    }


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
        //d.x = (x < 7)? (x + 7) : x;
        //d.y = (y < 7)? (y + 7) : y;


        d.tag = 'movie';
        d.id = i;

        if(!yearList.includes(d.title_year) && d.title_year) {

            yearList.push(d.title_year);
        }

    });


    yearList.sort(function (a,b){

        return a-b;
    });

    timeline(yearList, csvData);


});

