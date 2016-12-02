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


    var svg = d3.select('#bigbangsvg')
        .attr('height', svgHeight)
        .attr('width', svgWidth);


    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-10).distanceMin(15).distanceMax(100))
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(200))
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
            .merge(link)
            .attr('class','link');

    }
    else {

        link.remove();
    }

    var node = svg.select("#bigbangg")
        .selectAll(".node")
        .data(newData.nodes);


    node
        .exit()
        .remove();

    node = node.enter()
        .append("circle")
        .merge(node)
        .attr("class", function(d){

            if(d.tag == 'actor')
                return 'actor';
            return 'node';
        });

    node.on('mouseover',function (d) {

        div.text(function () {


            if(d.tag == 'movie')
                return d.movie_title;
            return d.actor;
            })
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px")
            .style('opacity',0.9);
        })
        .on("mouseout", function() {
            div.style("opacity", 0);
        });

    node.classed('node',true)
        .attr("r", 7)
        .attr("fill", 'gold');

    function ticked(){


        node

            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr('opacity',1);

        if(links) {
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
        .on('mouseover',function (d) {



        })
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

        })
        /*.on('click',function (d) {

            console.log(d);

            brushed();
        })*/;

    var brushed = function(){

        var selection = d3.event.selection || 0;//brush.extent();

        //if(Math.abs(selection[0] - selection[1]));


        var yearData = timelineArray.filter(function(d, i){

            //console.log(d);

            return i*widthOfRect >= selection[0] && i*widthOfRect <= selection[1];
        });


        var movieData = data.filter(function (d) {

            return yearData.includes(d.title_year);

        });

        if(yearData.length > 4)
            return;



        var actors = [];

        movieData.forEach(function(d){

            if(d.actor_1_name && !actors.includes(d.actor_1_name))
                actors.push(d.actor_1_name);
            //if(d.actor_2_name && !actors.includes(d.actor_2_name))
                //actors.push(d.actor_2_name);
            //if(d.actor_3_name && !actors.includes(d.actor_3_name))
                //actors.push(d.actor_3_name);
        });

        movieData.forEach(function(d){

            if(d.actor_2_name && !actors.includes(d.actor_2_name))
                actors.push(d.actor_2_name);
            //if(d.actor_3_name && !actors.includes(d.actor_3_name))
            //actors.push(d.actor_3_name);
        });

        movieData.forEach(function(d){

            if(d.actor_3_name && !actors.includes(d.actor_3_name))
                actors.push(d.actor_3_name);
        });




        function forces(){

            var force = [];
            var nodes = [];
            var links = [];

            var allmovies = [];
            var new_actors = actors;

            new_actors.forEach(function(d) {

                var movies = [];

                movieData.forEach(function (e) {

                    //var movie = new Object();
                    var flag = false;


                    if(d == e.actor_1_name || d == e.actor_2_name || d == e.actor_3_name) {

                        allmovies.forEach(function (f) {

                            if (e.movie_title == f.movie_title)
                                flag = true;

                        });

                        if(!flag) {

                            var link = new Object();

                            movies.push(e);
                            link.source = 0;
                            link.target = movies.length;
                            links.push(link);
                            allmovies.push(e);
                        }
                    }

                });

                var actorObject = new Object();
                actorObject.name = d;
                actorObject.tag = 'actor';
                actorObject.id = 0;


                if(movies.length>0)
                    nodes.push([actorObject].concat(movies));

                console.log(nodes);
                console.log(links);

                var forceobj = new Object();
                forceobj.nodes = nodes;
                forceobj.links = links;
                force.push(force);
            });


            console.log('forces = ' + force);


        }
        //update the select box and the nodes in the force field

        //forces();
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
        //d.x = (x < 7)? (x + 7) : x;
        //d.y = (y < 7)? (y + 7) : y;
        //d.x = nodeX * i * Math.random();
        //d.y = nodeY * i * Math.random();


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
