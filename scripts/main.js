//Detect browser support for CORS

// if ('withCredentials' in new XMLHttpRequest()) {
//     /* supports cross-domain requests */
//     alert("CORS supported (XHR)");
// }
// else if(typeof XDomainRequest !== "undefined"){
//     //Use IE-specific "CORS" code with XDR
//     alert("CORS supported (XDR)");
// }else{
//     //Time to retreat with a fallback or polyfill
//     alert("No CORS Support! Please enable CORS support before running");
// }

var sortkeys = ["Sort by Rating", "Sort by Movie Facebook Likes", "Sort by Budget", "Sort by Duration"];
var selectedYear=1985;
d3.csv("data/movie_metadata.csv", function (error, csvData) {
    var yearList = [];
    csvData.forEach(function (d, i) {
        d.actors = d.actor_1_name + ',' + d.actor_2_name + ',' + d.actor_3_name;
        if (yearList.indexOf(d.title_year) === -1) {
            if (d.title_year) {
                yearList.push(d.title_year);
            }
        }
    });
    yearList.sort();
    var slider = d3.slider().min(d3.min(yearList)).max(d3.max(yearList)).ticks(10).showRange(true).value(d3.max(yearList)).callback(updateOnSliderChange);
    d3.select('#year-slider').call(slider);
    console.log("len of csv data", csvData.length);
    function updateOnSliderChange(slider) {
        var year = Math.ceil(slider.value());
        selectedYear = year;
        var yearData = csvData.filter(function (d) {
            return d.title_year == year;
        });
        if (yearData.length >= 1) {
            updateVis(yearData, "movie_title");
        }
        else {
            alert("No movies processed for year " + selectedYear);
        }
        var alltiles = document.getElementById("movie-tiles");
        for (var i = 0; i < sortkeys.length; i++) {
            var but = document.createElement("button");
            but.value = sortkeys[i];
            switch (sortkeys[i]) {
                case "Sort by Rating":
                    but.onclick = sortbyrating(yearData);
                    but.id = "but-rating"
                    break;
                case "Sort by Movie Facebook Likes":
                    but.onclick = sortbylikes(yearData);
                    but.id = "but-likes";
                    break;
                case "Sort by Budget":
                    but.onclick = sortbybudget(yearData);
                    but.id = "but-budget";
                    break;
                case "Sort by Duration":
                    but.onclick = sortbyduration(yearData);
                    but.id = "but-dutation";
                    break;
            }
            alltiles.appendChild(but);
        }

    }

})
    function updateVis(yearData, text) {
        console.log("Going to update visualisation for", yearData[0].title_year);
        console.log("it has ", yearData.length, " movies");
        console.log("first movie", yearData[0])
        var requests = yearData.length;
        generateBlanktilesandButtons(yearData.length);
        var i = 0;
        while (requests > 0) {
            var url = "http://imdb.wemakesites.net/api/" + yearData[i].movie_imdb_link.split("/")[4];
            updateTile(url, "mtile-" + (i + 1).toString(), yearData[i][text]);
            // updatetile("mtile-"+(i+1).toString(),imageurl,yearData[i].movie_title);
            i++;
            requests--;
        }

    }

    function updateTile(url, tileid, title) {
        var req = $.getJSON(url, function (response) {
            console.log("image url:", response.data.image);
        });
        $.when(req).done(function (response) {
            updateImage(tileid, response.data.image, title)
        })
    }

    function generateBlanktilesandButtons(n) {
        console.log("generating ", n, " blank tiles");
        var alltiles = document.getElementById("movie-tiles");
        while (alltiles.firstChild) {
            alltiles.removeChild(alltiles.firstChild);
        }
        for (var i = 0; i < n; i++) {
            console.log('in loop generate blank tile');
            var elem = document.createElement("img");
            elem.setAttribute("src", "img/loading.gif");
            elem.setAttribute("class", "movie-tile")
            elem.setAttribute("id", "mtile-" + (i + 1).toString());
            elem.setAttribute("height", "250");
            elem.setAttribute("width", "250");
            elem.setAttribute("alt", "Please Wait While image is loaded");
            alltiles.appendChild(elem);
        }


    }

    function sortbyrating(yearData) {
        yearData.sort(function (x, y) {
            return d3.descending(parseFloat(x.imdb_score), parseFloat(y.imdb_score));
        });
        updateVis(yearData, "imdb_score");
    }

    function sortbylikes(yearData) {

    }

    function sortbybudget(yearData) {

    }

    function sortbyduration(yearData) {

    }

    function updateImage(tileid, url, title) {
        console.log("updating " + tileid + " with ", title);
        var tile = d3.select("#" + tileid);
        tile.classed("movie-tile", true);
        var image = document.getElementById(tileid);
        var downloadingImage = new Image();
        downloadingImage.onload = function () {
            image.src = this.src;
            image.alt = title;
            image.title = title;
        };
        downloadingImage.src = url;
    }

