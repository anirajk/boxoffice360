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
    for (var i=0;i<moviesData.length;i++) {
        console.log("processing movie #",(i+1).toString());
        var d=moviesData[i];
        d.director_name = [d.director_name];
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
            d.cast = (details.cast)?details.cast: [];
            d.review = (details.review)?details.review.text : "";
            d.writers = (details.writers)?details.writers :[];
            d.description = (details.description)?details.description: "";
            d.image_url = (details.image)?details.image : "";
            })
        jQuery.ajaxSetup({async:true});
        enrichedData[i]=d;
    }
    console.log("Writing enriched data,",enrichedData);
    downloadCSV(enrichedData);
    function convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }
    function downloadCSV(args) {
        var data, filename, link;

        var csv = convertArrayOfObjectsToCSV({
            data: enrichedData
        });
        if (csv == null) return;

        filename = args.filename || 'enriched_data.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }
    console.log("all done");

})
