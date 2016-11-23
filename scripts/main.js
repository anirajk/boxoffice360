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
}