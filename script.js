var dataP = d3.json("classData.json");
dataP.then(function(data)
{console.log(data, "data")
  drawChart(data);

},
function(err)
{
  console.log(err);
});
var drawChart = function(data)
{
//method for manipulating data---recieved help from Daniel B. and Kristin D
  var index = 0;
  data[index].quizes.forEach(function(d){d.type="Quiz"});
  data[index].homework.forEach(function(d){d.type="Homework"});
  data[index].final.forEach(function(d){d.type="Final"});
  data[index].test.forEach(function(d){d.type="Test"});
  var final = data[index].final;
  var finalAndQuiz = final.concat(data[index].quizes);
  var finalQuizHomework=finalAndQuiz.concat(data[index].homework);
  var allGrades=finalQuizHomework.concat(data[index].test);
  allGrades.forEach(function(d){
    d.percent=(d.grade/d.max)*100
  });
  console.log(allGrades, "all grades")
  var screen =
  {
    width: 750,
    height: 750
  }

  var margins =
  {
    top:10,
    bottom:40,
    left:40,
    right:10
  }
  var width = screen.width-margins.left-margins.right;
  var height = screen.height-margins.top-margins.bottom;

  var svg = d3.select('svg')
            .attr('width',screen.width)
            .attr('height',screen.height);

  console.log(data[index].homework);
  var xScale = d3.scaleLinear()
                .domain([0,40])
                .range([0,width]);
  var yScale = d3.scaleLinear()
                 .domain([0,100])
                 .range([height,0]);
  var plotLand = svg.append('g')
                .classed("plot",true)
                .attr("transform","translate("+margins.left+","+margins.top+")");
  var colors = d3.scaleOrdinal(d3.schemeSet1);
  var student = plotLand.selectAll('g')
                    .data(allGrades)
                    .enter()
                    .append('g')
                    .attr("fill",function(d){return colors(d.type)});
  student.selectAll("circle")
          .data(allGrades)
          .enter()
          .append('circle')
          .attr('cx',function(d)
          {
              return xScale(d.day)
          })
          .attr('cy',function(d)
          {
              return yScale(d.percent)})

          .attr('r',10);



          var xA = margins.top+height+10;
           var xAxis = d3.axisBottom(xScale);
           svg.append('g').classed('xAxis',true)
                         .call(xAxis)
                         .attr('transform','translate('+ margins.left + ','+xA+')' );
                  var yAxis = d3.axisLeft(yScale);
                 var yA = margins.left-10;
                 svg.append('g').classed('yAxis',true)
                               .call(yAxis)
                               .attr('transform','translate('+yA+ ','+'10'+')' );


  // buttons
  var buttons =
      d3.selectAll('img')
       .on('click',function()
       {

          innn = parseInt(this.name);
          updateChart(data,innn,plotLand,student, xScale, yScale,colors);
        });


}


var updateChart = function(data,index,plotLand,student, xScale, yScale,colors)
{console.log("update")
  data[index].quizes.forEach(function(d){d.type="Quiz"});
  data[index].homework.forEach(function(d){d.type="Homework"});
  data[index].final.forEach(function(d){d.type="Final"});
  data[index].test.forEach(function(d){d.type="Test"});
  var final = data[index].final;
  var finalAndQuiz = final.concat(data[index].quizes);
  var finalQuizHomework=finalAndQuiz.concat(data[index].homework);
  var allGrades=finalQuizHomework.concat(data[index].test);
  allGrades.forEach(function(d){
    d.percent=(d.grade/d.max)*100
  });
  console.log(allGrades);

  student.selectAll('circle')
    .data(allGrades)
    .attr('cx',function(d)
    {
      return xScale(d.day)
    })
    .attr('cy',function(d)
    {
        return yScale(d.percent)})
    .attr('r',10);



};
