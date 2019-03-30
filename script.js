var dataP = d3.json("classData.json");
dataP.then(function(data)
{
  parseData(data);
  drawChart(data);

})
var parseData = function(data)
{
  var homework = [];
  var homeworkdays = [];
  var quizes = [];
  var quizesdays = [];
  data.forEach(function(d,i)
  {
    d[i].homework.forEach(function(d)
  {
  homeworkdays.push(d.day);
  homework.push(d.grade);
  });
  d[i].quizes.forEach(function(d)
  {
  quizesdays.push(d.day);
  quizes.push(d.day);
  });
  })
  return homework,quizes;
console.log(homework)
}
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

  var svg = d3.select('svg')
            .attr('width',screen.width)
            .attr('height',screen.height);
  var index = 0;
  console.log(data);
  var plotLand = svg.append('g')
                .classed("plot",true)
                .attr("transform","translate("+margins.left+","+margins.top+")")
                .attr('height',height-margins.top-margins.bottom)
                .attr('width',width-margins.left-margins.right);
  var xScale = d3.scaleTime()
                .domain([0,40])
                .range([0,width]);
  var yScale = d3.scaleLinear()
                 .domain([0,50])
                 .range([height,0]);


  console.log(data[index].homework[0].day,data[index].homework[0].grade)
  var line = d3.line()
               .x(function(d,i){return xScale(d[0].homework[i].day);})
               .y(function(d,i){return yScale(d[0].homework[i].grade);});

  plotLand.append('path')
          .datum(data)
          .attr('class',"line")
          .attr('d',line);


  // buttons
  var buttons =
      d3.selectAll('img')
       .on('click',function()
       {

          index = intParse(this.name);
          updateChart(data,index,plotLand,line);
        });


}


var updateChart = function(data,index,plotLand,l)
{

  var line = d3.line()
               .x(function(d){return xScale(d[index].homework.day);})
               .y(function(d){return yScale(d[index].homework.grade);});
  var students =
      plotLand.selectAll('path')
      .datum(data)
      .attr('class',"line")
      .attr('d',line);



};
