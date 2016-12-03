var sortkeys = ["Sort by Rating", "Sort by Movie Facebook Likes", "Sort by Budget", "Sort by Duration"];
var selectedYear=1985;
var moviesData = [];

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


function updateBarChart(data) {

    var margin = {top: 20, right: 20, left: 20, bottom: 20};

    var svg = d3.select("#barChartsvg"),
        xAxisWidth = 650,
        yAxisHeight = 450;


    var width = xAxisWidth - margin.left - margin.right;
    var height = yAxisHeight - margin.top - margin.bottom - 20;


    svg.attr('width', width)
        .attr('height',height);


    var highGrossingData = data.sort(function(a,b){

        return b.gross - a.gross;
    });

    var top5HighGrossingData = highGrossingData.slice(0,5);


    var max = d3.max(top5HighGrossingData, function(d){


        return d.gross;
    })        ;

    var min = d3.min (top5HighGrossingData, function (d) {

        return d.gross;
    });

    var xScale = d3.scaleLinear()
        .domain([0 , max])
        .range([0,width]);



    var yScale = d3.scaleBand()
        .range([0, height]).padding(.1)
        .domain(data.map(function (d) {
            return d.movie_title;
        }));

    var xAxis = d3.axisBottom();
    xAxis.scale(xScale);



    var textWidth = 80;
    svg.select("#xAxis")
        .classed("axis", true)
        .attr("transform", "translate(" + (margin.left+margin.right) + "," + (height-25) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)" );


    var yHeight = (height)/6;

    var bars = d3.select('#barChartg')
        .selectAll('.bars')
        .data(top5HighGrossingData);


    bars.exit()
        .remove();

    bars = bars.enter()
        .append('rect')
        .merge(bars);

    var textWidth = 80;

    bars.on('mouseover',function(d){
        div.text(function () {



                return 'Movie '+ d.movie_title  + ', Budget : $' + d.gross;

        })
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY-20) + "px")
            .style('opacity', 0.9);
    })
        .on("mouseout", function () {
            div.style("opacity", 0);
        })
        .attr('class','bars')
        .attr('x', textWidth)
        .attr('y', function(d,i){

            if(i==0)
                return 0;
            else
                return (yHeight + 4)*i;
        })
        .attr('width',function (d) {

            return xScale(0);
        })
        .attr('height', function (d) {

            return yHeight;

        })
        .transition()
        .duration(3000)
        .attr('x', textWidth)
        .attr('y', function(d,i){

            if(i==0)
                return 0;
            else
                return (yHeight + 4)*i;
        })
        .attr('width',function (d) {

            if(d.gross)
                return xScale(d.gross) - xScale(0);
            else
                return 0;
        })
        .attr('height', function (d) {

            return yHeight;

        });



}


d3.json("data/merged_data.json", function (error, csvData) {
    var yearList = [];



    $.ajaxSetup({async:true});

    csvData.forEach(function (d) {
        var i,count=0;
        for (i=0;i<moviesData.length;i++){
            if (d.movie_title == moviesData[i].movie_title){
                count++;
                if(count)
                    break;
            }
        }
        if ( count == 0){
            moviesData.push(d);
        }
    });



    moviesData.forEach(function (d, i) {
        if(!yearList.includes(d.title_year) && d.title_year) {
            yearList.push(d.title_year);
        }


    });

    yearList.sort();

    var slider = d3.slider()
        .min(d3.min(yearList))
        .max(d3.max(yearList))
        .ticks(10)
        .tickFormat(Math.ceil)
        .showRange(true)
        .value(d3.max(yearList))
        .callback(updateOnSliderChange);

    d3.select('#year-slider').call(slider);

    function updateOnSliderChange(slider) {
        var year = Math.ceil(slider.value());
        selectedYear = year;
        var yearData = moviesData.filter(function (d) {
            return d.title_year == year;
        });

        for(var i=1;i<=10;i++){

            d3.select('#mtile-' + i)
                .attr('src','img/blank.png')
                .attr('title','');

        }
        if (yearData.length >= 1) {
            updateVis(yearData, "movie_title");
        }
        else {
            alert("No movies processed for year " + selectedYear);
        }
        var buttons = document.getElementById("sort-buttons");
        while (buttons.firstChild) {
            buttons.removeChild(buttons.firstChild);
        }
        for (var i = 0; i < sortkeys.length; i++) {
            var but = document.createElement('input');
            but.type = "button";
            but.value = sortkeys[i];
            switch (sortkeys[i]) {
                case "Sort by Rating":
                    but.onclick = function(){sortbyrating(yearData)};
                    but.id = "but-rating";
                    break;
                case "Sort by Movie Facebook Likes":
                    but.onclick = function(){sortbylikes(yearData)};
                    but.id = "but-likes";
                    break;
                case "Sort by Budget":
                    but.onclick = function(){sortbybudget(yearData);}
                    but.id = "but-budget";
                    break;
                case "Sort by Duration":
                    but.onclick = function(){sortbyduration(yearData)};
                    but.id = "but-duration";
                    break;
            }
            buttons.appendChild(but);

            updateBarChart(yearData);

        }

    }

});
function updateVis(yearData, text) {

    var requests = (yearData.length<10)?yearData.length:10;

    //generateBlanktilesandButtons(yearData.length);
    var i = 0;
    while (requests > 0) {
        //var url = "http://img.omdbapi.com/?i="+yearData[i].movie_imdb_link.split("/")[4]+"&apikey=68e40e34";
        var url = "http://imdb.wemakesites.net/api/" + yearData[i].movie_imdb_link.split("/")[4];
        d3.select('#mtile-'+(i+1))
            .attr('src','img/loading.gif')
            .attr('title', 'loading...');

        if(yearData[i].image_url!="NA")
            updateImage("mtile-" + (i + 1).toString(), yearData[i].image_url, yearData[i][text], yearData[i].movie_title);
        else
            updateTile(url, "mtile-" + (i + 1).toString(), yearData[i][text], yearData[i].movie_title);
        i++;
        requests--;
    }

}

function updateTile(url, tileid, title, movie_name ) {
    var req = $.getJSON(url, function (response) {

    }).fail(function () {
        updateImage(tileid, "img/blank.png", title, movie_name)
    });
    $.when(req).done(function (response) {
        updateImage(tileid, response.data.image, title, movie_name)
    })


}


function sortbyrating(yearData) {
    yearData.sort(function (x, y) {
        return d3.descending(parseFloat(x.imdb_score), parseFloat(y.imdb_score));
    });
    updateVis(yearData, "imdb_score");
}

function sortbylikes(yearData) {
    yearData.sort(function (x, y) {
        return d3.descending(parseInt(x.movie_facebook_likes), parseInt(y.movie_facebook_likes));
    });
    updateVis(yearData, "movie_facebook_likes");

}

function sortbybudget(yearData) {
    yearData.sort(function (x, y) {
        return d3.descending(parseInt(x.budget), parseInt(y.budget));
    });
    updateVis(yearData, "budget");

}

function sortbyduration(yearData) {
    yearData.sort(function (x, y) {
        return d3.descending(parseInt(x.duration), parseInt(y.duration));
    });
    updateVis(yearData, "duration");

}

function updateImage(tileid, url, title, movie_name) {

    var tile = d3.select("#" + tileid);

    tile.attr("src", url)
        .attr('title',title);

    var movie = moviesData.forEach(function(d){

        if( d.movie_title.toLowerCase() == movie_name.toLowerCase()) {

            d.src = url;
        }
    });



    tile.on('click',function(d){

        var movie = moviesData.filter(function(e){

            return e.movie_title.toLowerCase() == movie_name.toLowerCase();
        });

        d3.select('#movie')
            .text(function() {

                return 'Movie: ' + movie[0].movie_title;

            });

        d3.select('#director')
            .text(function(){

                if(movie[0].director_name)
                    return 'Director: ' + movie[0].director_name;
                else
                    'Director: ' + 'Not Available';
            });

        d3.select('#actors')
            .text(function(){

                if (movie[0].actor_1_name || movie[0].actor_2_name || movie[0].actor_3_name)

                    return 'Actors: ' + movie[0].actor_1_name +' , '+ movie[0].actor_2_name +' , '+ movie[0].actor_3_name;

                else
                    return 'Actors: Not Available';
            });

        d3.select('#genre')
            .text(function(){

                return 'Genre: ' + movie[0].genres;
            });

        d3.select('#budget')
            .text(function(){

                return 'Budget: $' + movie[0].budget;
            });

    });
}