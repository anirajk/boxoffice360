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

    var node = svg.append("g")
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
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
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
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    /*var centerBar = d3.select('#electoral-vote')
        .select('svg')
        .selectAll('.middlePoint')
        .data([2]);

    centerBar.exit().remove();

    centerBar = centerBar.enter()
        .append('rect')
        .classed('middlePoint',true)
        .merge(centerBar);

    centerBar
        .attr('x', self.svgWidth/2)
        .attr('width', function(d){
            return d;
        })
        .attr('y', (0.25 * self.svgHeight))
        .attr('height', (0.7 * self.svgHeight) - (0.25 * self.svgHeight) );

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    var i_data = [];

    i_data.sum = d3.sum(voteChartData,function(d){


        if(d.RD_Difference == 0) {

            return d.Total_EV;
        }
    });

    i_data.party = 'I';

    for(i=0;i<voteChartData.length;i++) {

        if(voteChartData[i]['State_Winner'] == 'I') {

            i_data.xscale = voteChartData[i].xscale;
            break;
        }
    }

    var d_data = [];
    var count = 0;

    d_data.sum = d3.sum(voteChartData,function(d){

        if(d.State_Winner.toUpperCase() == 'D')
            return d.Total_EV;
    });
    d_data.party = 'D';

    //making the democratic to appear a little to the right because it was
    // overlapping with the independent party for the year 1960

    for(i=0;i<voteChartData.length;i++) {

        if(voteChartData[i]['State_Winner'] == 'D') {

            d_data.xscale = voteChartData[i].xscale;

            count++;

            if(count == 3)
                break;

        }
    }

    var r_data = [];

    r_data.sum = d3.sum(voteChartData,function(d){

        if(d.State_Winner.toUpperCase() == 'R')
            return d.Total_EV;
    });
    r_data.party = 'R';

    for(i=0;i<voteChartData.length;i++) {

        if(voteChartData[i]['State_Winner'] == 'R') {

            r_data.xscale = voteChartData[i].xscale;

        }
    }

    var mid_point = [];
    mid_point.sum = d3.sum(voteChartData,function(d){

        return d.Total_EV;
    });

    mid_point.sum = Math.ceil(mid_point.sum/2);

    mid_point.party = 'mid';

    mid_point.xscale = (self.svgWidth/2) - 100;*/



    /*var datafortext =  [d_data,r_data,mid_point];


    if(i_data.sum > 0){

        datafortext.push(i_data);
    }

    var text = d3.select('#timeline')
        .select('svg')
        //.selectAll('.electoralVoteText')
        .data(datafortext);

    text.exit().remove();

    text = text.enter()
        .append('text')
        .merge(text);

    text.attr('x',function(d){

        return d.xscale;
    })
        .attr('y', (0.2 * self.svgHeight))
        .attr('class',function(d){

            if(d.party == 'mid')
                return 'electoralVoteText';

            return 'electoralVoteText ' + self.chooseClass(d.party);
        })
        .text(function(d){

            if(d.party == 'mid')
                return 'Electoral Vote('+d.sum+' needed to win)';
            return d.sum;
        });

*/

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

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
        d.x = nodeX * i * Math.random();
        d.y = nodeY * i * Math.random();

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
