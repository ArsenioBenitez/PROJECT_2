var dataP = d3.json("classData.json");
dataP.then(function(data)
{
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

  var screen =
  {
    width: 600,
    height: 500
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

  var xScale = d3.scaleLinear()
                .domain([0,41])
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
                    .append('g');
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

          .attr('r',5)
          .attr("fill",function(d)
          {
            if(d.type=="Quiz")
            {
              return 'red';
            }
            else if(d.type=="Homework")
            {
              return 'blue';
            }
            else if(d.type=="Test")
            {
              return 'green';
            }
            else if(d.type=="Final")
            {
              return 'pink';
            }

          });



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
  var images =
      d3.selectAll('img')
       .on('click',function()
       {
          inn = parseInt(this.name);
          view= 'scatter';
          updateChart(data,inn,plotLand,student, xScale, yScale,colors,view,height, width);
        });
var change_view =
      d3.select('button')
      .attr('x',100)
      .attr('y',200)
      .on('click',function()
      {
        //inn = index;
        view='line';
        updateChart(data,inn,plotLand,student, xScale, yScale,colors,view,height, width);
      });
var getClassAvg = d3.select("#average")
                    .on('click',function()
                    {
                      view = 'classAv';
                      inn = index;
                      updateChart(data,inn,plotLand,student, xScale, yScale,colors,view,height, width);
                    })
// var days = d3.select('<.days>')
//               .on('click',function()
//               {
//                 if(this.name=='prev')
//                 {
//                   var inn = -1;
//
//                 }
//                 if (this.name=="next")
//                 {
//                   var inn=1;
//                 }
//                 updateChart(data, inn, plotLand, student, xScale, yScale, colors, "classAv", height)
//               })

}


var updateChart = function(data,index,plotLand,student, xScale, yScale,colors,view,height, width)
{//console.log("update")
if(view=='scatter')
{
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

  student.selectAll('circle')
    .data(allGrades)
    .attr('cx',function(d)
    {
      return xScale(d.day)
    })
    .attr('cy',function(d)
    {
        return yScale(d.percent)})
    .attr('r',5);
}
if(view=='line')
{
data[index].quizes.forEach(function(d){d.type="Quiz"});
data[index].homework.forEach(function(d){d.type="Homework"});
data[index].final.forEach(function(d){d.type="Final"});
data[index].test.forEach(function(d){d.type="Test"});
var final = data[index].final;
var finalAndQuiz = final.concat(data[index].quizes);
var quiz=data[index].quizes;
var finalQuizHomework=finalAndQuiz.concat(data[index].homework);
var homework=data[index].homework;
var allGrades=finalQuizHomework.concat(data[index].test);
var test=data[index].test;
quiz.forEach(function(d){
  d.quizPercent=(d.grade/d.max)*100
});
test.forEach(function(d){
  d.testPercent=(d.grade/d.max)*100
});
homework.forEach(function(d){
  d.homeworkPercent=(d.grade/d.max)*100
});
final.forEach(function(d){
  d.finalPercent=(d.grade/d.max)*100
});
  xScale=d3.scaleTime()
          .domain([0,41])
          .range([0, width])
  yScale=d3.scaleLinear()
          .domain([0,100])
          .range([height,0]);

  var quizLine=d3.line()
  .x(function(d){
      return xScale(parseInt(d.day))})
  .y(function(d){
    return yScale(d.quizPercent)})

    plotLand.append('path')
      .datum(quiz)
      .attr('class','line')
      .attr('d',quizLine)
      .attr("fill", "none")
      .attr("stroke", "red")

      var homeworkLine=d3.line()
      .x(function(d){
          return xScale(parseInt(d.day))})
      .y(function(d){
        return yScale(d.homeworkPercent)})

        plotLand.append('path')
          .datum(homework)
          .attr('class','line')
          .attr('d',homeworkLine)
          .attr("fill", "none")
          .attr("stroke", "blue")

          var testLine=d3.line()
          .x(function(d){
              return xScale(parseInt(d.day))})
          .y(function(d){
            return yScale(d.testPercent)})

            plotLand.append('path')
              .datum(test)
              .attr('class','line')
              .attr('d',testLine)
              .attr("fill", "none")
              .attr("stroke", "green")

              var homeworkLine=d3.line()
              .x(function(d){
                  return xScale(parseInt(d.day))})
              .y(function(d){
                return yScale(d.finalPercent)})

                plotLand.append('path')
                  .datum(final)
                  .attr('class','line')
                  .attr('d',finalLine)
                  .attr("fill", "none")
                  .attr("stroke", "green")
    }




if(view=='classAv')
{
  data.forEach(function(d){d.quizes.forEach(function(d){d.type="Quiz"});})
  data.forEach(function(d){d.homework.forEach(function(d){d.type="Homework"});})
  data.forEach(function(d){d.final.forEach(function(d){d.type="Final"});})
  data.forEach(function(d){d.test.forEach(function(d){d.type="Test"});})
console.log(data)
  var final=data.forEach(function(d){return d.final})
  var quiz=data.forEach(function(d){return d.quizes})
  var finalAndQuiz=final.concat(quiz)
  var homework=data.forEach(function(d){d.homework.forEach(function(d){return d.grade})})
  var finalQuizHomework=finalAndQuiz.concat(homework)
  var test=data.forEach(function(d){d.homework.forEach(function(d){return d.grade})})
  var allGrades=finalQuizHomework.concat(test)

  console.log(final, "final")

  allGrades.forEach(function(d){
    d.percent=(d.grade/d.max)*100
  });
  student.selectAll('circle')
    .data(allGrades)
    .attr('cx',function(d)
    {
      return xScale(d.day)
    })
    .attr('cy',function(d)
    {
        return yScale(d.percent)})
    .attr('r',5);
}

};


