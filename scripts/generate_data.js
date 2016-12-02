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
    var enrichedData = []
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
    var newData = [];
    //var original_len = 3;
    var original_len = moviesData.length;
    var requests = original_len;
    var i=0;
    while(requests>0) {
        console.log("processing movie #",(i+1).toString());
        moviesData[i].id = moviesData[i].movie_imdb_link.split("/")[4];
        var url = "http://imdb.wemakesites.net/api/" + moviesData[i].id;
        console.log("url:",url);
        getNewData(url);
        i++;
        requests--;
    }

    function getNewData(url) {
        var req = $.getJSON(url, function (response) {
          //  console.log("response data:", response.data);
        });
        $.when(req).done(function (response) {
            var d={};
            var details = response.data;
            d.cast = (details.cast)?details.cast: [];
            d.review = (details.review)?details.review.text : "";
            d.writers = (details.writers)?details.writers :[];
            d.description = (details.description)?details.description: "";
            d.image_url = (details.image)?details.image : "";
            d.directors = (details.directors)?details.directors:[];
            d.id = (details.id)?details.id:"";
            newData.push(d);
            console.log("processed ",newData.length, " movies");
            if (newData.length==original_len){
                mergeData(newData);
            }
        })

    }

    function mergeData(data) {
        console.log("merging data sets")
        var merged_data = []
        for  (var i=0;i<original_len;i++){
            for (var j=0;j<original_len;j++){
                if(moviesData[i].id==data[j].id){
                    moviesData[i].directors = data[j].directors;
                    moviesData[i].image_url = data[j].image_url  ;
                    moviesData[i].review = data[j].review;
                    moviesData[i].cast = data[j].cast;
                    moviesData[i].description = data[j].description;
                    merged_data.push(moviesData[i])
                }
            }
        }
        writejson(merged_data)
    }



    function writejson(data) {
        console.log("final data len:", data.length);
        console.log(data);
        var json = JSON.stringify(data);
        var blob = new Blob([json], {type: "application/json"});
        var url  = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "enriched_data.json");
        document.body.appendChild(link); // Required for FF
        link.click();
    }

 })
