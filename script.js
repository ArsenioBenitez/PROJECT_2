var dataP = d3.json("classData.json");
dataP.then(function(data)
{
  drawChart(data);

})

var drawChart = function(data)
{

  var screen =
  {
    width: 500,
    height: 400
  }

  var margins =
  {
    top:10,
    bottom:40,
    left:40,
    right:100
  }
  var width = screen.width-margins.left-margins.right;
  var height = screen.height-margins.top-margins.bottom;
  var barWidth = width/4;
  var xScale = d3.scaleTime()
                .domain([d3.min(data,function(d){return d.day;}),d3.max(data,function(d){return d.day;})])
                .range([0,width]);
  var yScale = d3.scaleLinear()
                .domain([0,d3.max(data,function(d){return d.homework[0].max;})])
                .range([height,0]);
  var line = d3.line()
               .x(function(d){return xScale(data.homework.day);})
               .y(function(d){return yScale(data[0].homework.grade);});
  var svg = d3.select('svg#s')
            .attr('width',screen.width)
            .attr('height',screen.height);

  var plotLand = svg.append('g')
                .classed("plot",true)
                .attr("transform","translate("+margins.left+","+margins.top+")");

  var students =
      plotLand.selectAll('path')
      .datum(data)
      .attr('class',"line")
      .attr('d',line);


  // buttons
  var buttons =
      d3.selectAll('img')
       .on('click',function()
       {

          if (this.name=='prev')
          {
            var clicked = 'prev';
          }
          else if (this.name=='next')
          {
            var clicked = 'next';
          }
           updateChart(data,clicked,plotLand,height);
        });


}


var updateChart = function(data,clicked,plotLand,h)
{

  var day = document.getElementById("day").textContent;
  console.log(data[0].grades);
  if (clicked=='')
  {
    //do something
    var dd = parseInt(day)-2;
    var students =
        plotLand.selectAll('rect')
        .data(data[dd].grades)
        .attr('y', function(d)
        {
        return  h-d.grade;
        })
      var p = document.getElementById('day');
      p.innerText = dd+1;

  }
  else if(clicked=='next')
  {
    //
    console.log(parseInt(day));
    var dd = parseInt(day)+1;
    var students =
        plotLand.selectAll('rect')
        .data(data[dd].grades)
        .attr('y', function(d)
        {
        return  h-d.grade;
        })
    var p = document.getElementById('day');
    p.innerText = dd;

  }

};
