//Detect browser support for CORS
if ('withCredentials' in new XMLHttpRequest()) {
    /* supports cross-domain requests */
    alert("CORS supported (XHR)");
}
else if(typeof XDomainRequest !== "undefined"){
    //Use IE-specific "CORS" code with XDR
    alert("CORS supported (XDR)");
}else{
    //Time to retreat with a fallback or polyfill
    alert("No CORS Support! Please enable CORS support before running");
}


d3.csv("data/movie_metadata.csv", function (error, csvData) {

    var yearList = [];
    csvData.forEach(function (d, i) {
        d.actors = d.actor_1_name + ',' + d.actor_2_name + ',' + d.actor_3_name;
        if(yearList.indexOf(d.title_year) === -1){
            if (d.title_year) {
                yearList.push(d.title_year);
            }
        }
    });
    yearList.sort();
    var slider = d3.slider().min(d3.min(yearList)).max(d3.max(yearList)).ticks(10).showRange(true).value(d3.max(yearList)).callback(updateOnSliderChange);
    d3.select('#year-slider').call(slider);
    console.log("len of csv data",csvData.length);
    function updateOnSliderChange(slider) {
        var year = d3.format(".0f")(slider.value());
        var yearData = csvData.filter(function (d) {
            return d.title_year == year;
        });
     if (yearData.length>=1) {
         updateVis(yearData);
     }
     else {
         console.log("No movies processed for year", year);
     }
    }

})

function updateVis(yearData) {
    console.log("Going to update visualisation for", yearData[0].title_year);
    console.log("it has ",yearData.length," movies");
    var requests = yearData.length;
    var i=0;
    while (requests>0){
        var url = "http://imdb.wemakesites.net/api/"+yearData[i].movie_imdb_link.split("/")[4];
        console.log("i in loop",i);
        console.log("here");
        updateTile(url,"mtile-"+(i+1).toString(),yearData[i].movie_title);
        // updatetile("mtile-"+(i+1).toString(),imageurl,yearData[i].movie_title);
        i++;
        requests--;
    }

}

function updateTile(url,tileid,title) {
    var req= $.getJSON(url, function (response) {
        console.log("image url:",response.data.image);
    });
    $.when(req).done(function (response) {
        updateImage(tileid,response.data.image,url)
    })
}


function updateImage(tileid,url,title) {
    console.log("updating "+tileid+" with ",url);
    var tile = d3.select("#"+tileid);
    tile.classed("movie-tile",true);
    console.log("d3 select tile",tile);
    var image = document.getElementById(tileid);
    var downloadingImage = new Image();
    downloadingImage.onload = function(){
        image.src = this.src;
        image.alt=title;
        image.title=title;
    };
    downloadingImage.src = url;
}