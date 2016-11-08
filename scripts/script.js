/**
 * Created by Ashwini on 11/7/2016.
 */

d3.select('#tab1')
.on('click',function(){

    d3.select('#content2').attr('class','hide');
    d3.select('#content1').attr('class','show');
    d3.select('#tab1').style('background-color','steelblue');
    d3.select('#tab2').style('background-color','buttonface');
});

d3.select('#tab2')
    .on('click',function(){

        d3.select('#content1').attr('class','hide');
        d3.select('#content2').attr('class','show');
        d3.select('#tab2').style('background-color','steelblue');
        d3.select('#tab1').style('background-color','buttonface');
});