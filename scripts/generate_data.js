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


d3.csv("data/movie_metadata.csv", function (error, csvData) {
    var yearList = [];

    var moviesData = [];
    console.log("csv len",csvData.length);

    csvData.forEach(function (d) {
        var i,count=0;
        for (i=0;i<moviesData.length;i++){
            if (d.movie_imdb_link == moviesData[i].movie_imdb_link){
                count++;
            }
        }
        if ( count == 0){
            moviesData.push(d);
        }else if (count>0){
            console.log('dup');
        }else{
            console.log('shit broke');
        }
    });
    console.log("dedup len", moviesData.length);
    for (var i=0;i<moviesData.length;i++) {
        var d=moviesData[i];
        d.director_name = [d.director_name];
        // console.log(i);
        if (i>2)
            break;
        var url = "http://imdb.wemakesites.net/api/" + d.movie_imdb_link.split("/")[4];
        console.log("url:",url);
        jQuery.ajaxSetup({async:false});

        var req = $.getJSON(url, function (response) {
                console.log("original data:",d);
                console.log("response data:", response.data);
        });
        $.when(req).done(function (response) {
            var details = response.data;
            if (details.directors.length){
                for (var j=0;j<details.directors.length;j++){
                    if (details.directors[i]!= d.director_name[0]){
                        d.director_name.push(details.directors[i])
                    }
                    }
                }
            d.cast = details.cast;
            d.review = details.review.text;
            d.writers = details.review.writers;
            d.description = details.description;
            d.image_url = details.image;
            })
        jQuery.ajaxSetup({async:true});
        moviesData[i]=d;
    }
    console.log("Writing enriched data");
    var csvContent = "data:text/csv;charset=utf-8,";
    moviesData.forEach(function(infoArray, index){

        var dataString = infoArray.join(",");
        csvContent += index < moviesData.length ? dataString+ "\n" : dataString;

    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data/enriched_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".

})
