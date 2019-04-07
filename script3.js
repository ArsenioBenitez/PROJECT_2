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
////get data
  var allGrades = [];
  var getHw = data[0].homework.forEach(function(d,i)
  {//d is every homework object
    var day = d.day;

    data.forEach(function(s)
    {//s is each student

    var grades =
    {
         grade: s.homework[i].grade,
         day: day,
         index: s.picture,
         type:'homework'
    }
       allGrades.push(grades)
    });
  });
  var getQz = data[0].quizes.forEach(function(d,i)
  {//d is every quiz object
    var day = d.day;
    data.forEach(function(s)
    {//s is each student
    var grades =
    {
         grade: s.quizes[i].grade,
         day: day,
         index:s.picture,
         type:'quiz'
    }
       allGrades.push(grades)
    });
  });
  var getTs = data[0].test.forEach(function(d,i)
  {//d is every quiz object
    var day = d.day;
    data.forEach(function(s)
    {//s is each student
    var grades =
    {
         grade: s.test[i].grade,
         day: day,
         index:s.picture,
         type:'test'
    }
       allGrades.push(grades)
    });
  });
  var getF = data[0].final.forEach(function(d,i)
  {//d is every final object
    var day = d.day;
    data.forEach(function(s)
    {//s is each student
    var grades =
    {
         grade: s.final[i].grade,
         day: day,
         index:s.picture,
         type:'final'

    }
    ;
       allGrades.push(grades)
    });
  });
  var gradesByDays = [];
  listDays=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,41]
  listDays.forEach(function(d,i)
  {//d is homework object
    var day = d;
    var grades = [];
    allGrades.forEach(function(g)
    {//g is single grade object
      if(g.day==day)
      {
        grades.push(g);
      }
    })
    gradesByDays.push(grades);
  })
  //calculate class averages
  var averagesByDay = []
  gradesByDays.forEach(function(d,i)
  {//list of grades for each day
    var types = 0;
    var hw_total =0;
    var qz_total =0;
    var tt_total=0;
    var fl_total = 0;
    var avg = 0;
    d.forEach(function(s)
    {//grade in each day

      if(s.type=="homework")
      {
        hw_total+=s.grade*2;
        types+=1;
      }
      else if(s.type=="quiz")
      {
        qz_total+=s.grade*10;
      }
      else if(s.type=="test")
      {
        tt_total+=s.grade;
      }
      else if(s.type=="final")
      {
        fl_total+=s.grade;
      }
      total = ((hw_total*.15)+(qz_total*.15)+(tt_total*.20)+(fl_total*.3))/18.4;
      if(i==14||i==29)
      {
         avg = tt_total/23;
      }
      else if(i==40)
      {
         avg = fl_total/23;
      }
      else if(i%2==1&&i!=29)
      {
         avg = total/.3;
      }
      else
      {
         avg = qz_total/23;
      }
    })
    var classAv =
    {
      average: avg,
      day: i
    }
    averagesByDay.push(classAv);
  })

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


var xScale=d3.scaleLinear()
            .domain([0,41])
                     //.domain([0,d3.max(hw, function(d){return d.day;})])
            .range([0, width]);
var yScale=d3.scaleLinear()
            .domain([0,100])
            .range([height,0]);
var plotLand = svg.append('g')
                .classed("plot",true)
                .attr("transform","translate("+margins.left+","+margins.top+")");
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

//make line
var drawLine = d3.line()
               .x(function(d,i){
                 return xScale(i)})
               .y(function(d){return yScale(d.average)})
               .curve(d3.curveCardinal);
plotLand.append('path')
     .datum(averagesByDay)
     .attr('class',"line")
     .attr('d',drawLine)
     .attr("fill", "none")
     .attr("stroke", "red");
var images =
         d3.selectAll('img')
          .on('mouseover',function()
          {
             name = parseInt(this.name);
             inn = name;
             updateChart(data,inn,plotLand,svg, xScale, yScale,height, width);

           })
           .on('mouseout',);

}



var updateChart = function(data,index,plotLand,student, xScale, yScale,height, width)
{//console.log("update")

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




};
