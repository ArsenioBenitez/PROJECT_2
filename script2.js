//get promise
var dataP = d3.json("classData.json");
dataP.then(function(data)
{
  drawChart(data);


},
function(err)
{
  console.log(err);
});
//////////////////
//////////////////
var drawChart = function(data)
{
////Step 1: get data
  var allGrades = [];//this will contain all of the grade objects
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
  //sort grade objects by their days
  var gradesByDays = [];
  listDays=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,41]
  listDays.forEach(function(d,i)
  {//d is homework object
    var day = d;//help us keep track of the day
    var grades = [];//array for each day
    allGrades.forEach(function(g)
    {//g is single grade object
      if(g.day==day)//if from the same day push into this day's array
      {
        grades.push(g);
      }
    })
    gradesByDays.push(grades);
  })
  //calculate class averages: we now have all the grades by day so we can use that to calculate a moving
  //average for the class

  var averagesByDay = []
  gradesByDays.forEach(function(d,i)
  {
    //list of grades for each day
    var hw_total =0;
    var qz_total =0;
    var tt_total=0;
    var fl_total = 0;
    var avg = 0;
    d.forEach(function(s)
    {//s is grade object in each day
///lots of mathhhhh
      if(s.type=="homework")
      {
        hw_total+=s.grade*2;
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
    })


      if (i==14||i==29)
      {avg= tt_total/23}

      else if(i==40)
      {avg=fl_total/23}

      else if (i%2==i&&i!=29)
      {avg=((hw_total+qz_total)/2)/23}

      else{avg=qz_total/23}




//haha now we've got an object with the class average for every day
    var classAv =
    {
      average: avg,
      day: i
    }
    averagesByDay.push(classAv);
  });
//make the screen
var screen =
{
  width: 1200,
  height: 500
}

var margins =
{
  top:10,
  bottom:100,
  left:100,
  right:200
}
var width = screen.width-margins.left-margins.right;
var height = screen.height-margins.top-margins.bottom;

var svg = d3.select('#lineChart')
          .attr('width',screen.width)
          .attr('height',screen.height);
//setup scales

var xScale=d3.scaleLinear()
            .domain([0,41])
                     //.domain([0,d3.max(hw, function(d){return d.day;})])
            .range([0, width]);
var yScale=d3.scaleLinear()
            .domain([0,100])
            .range([height,0]);
var plotLand = svg.append('g')
                .classed("plot",true)
                .attr('width',width)
                .attr('height',height)
                .attr("transform","translate("+margins.left+","+margins.top+")");
//
//setup your axi
 var xA = margins.top+height+20;
 var xAxis = d3.axisBottom(xScale);
 svg.append('g').classed('xAxis',true)
     .call(xAxis)
     .attr('transform','translate('+ margins.left + ','+xA+')' );
 var yAxis = d3.axisLeft(yScale);
 var yA = margins.left-10;
 svg.append('g').classed('yAxis',true)
     .call(yAxis)
     .attr('transform','translate('+yA+ ','+'10'+')' );
//make axis labels
var yLabel =svg.append('text')
            .attr('transform','rotate(-90)')
            .attr('y',0+margins.left-50)
            .attr('x',0-(height/2))
            .text('Average Grade');
var xLabel =svg.append("text")
            .attr('transform','translate('+(width+margins.left)/2 + ','+(xA+30)+')' )
            .text('Day');
svg.select('div.students')
    .attr('y',height+30);
//make line
var drawLine = d3.line()
               .x(function(d,i){
                 return xScale(i)})
               .y(function(d){return yScale(d.average)})
               .curve(d3.curveCardinal);
plotLand.append('path')
     .datum(averagesByDay)
     .transition().duration(10)
     .attr('class',"line")
     .attr('d',drawLine)
     .attr("fill", "none")
     .attr("stroke", "red")
     .attr("stroke-width", 3)

    plotLand.selectAll("circle")
    .data(averagesByDay)
    .enter()
    .append("circle")
     .attr("class", "dot")
     .attr("cx", function(d,i){return xScale(i)})
     .attr("cy", function(d){return yScale(d.average)} )
     .attr("r", 5)
     .attr("fill", "red")

     .on("mouseover", function(d, i){
       d3.selectAll("rect").remove()
       plotLand.append("rect")
       .attr("x", xScale(i))
       .attr("y", yScale(d.average))
       .attr("width", 50)
       .attr("height", 30)
       .attr("fill", "white")

       plotLand.append("text")
       .attr("id", "tooltip")
       .attr("x", xScale(i)+15)
       .attr("y", yScale(d.average)+15)
       .attr("tet-anchor", "middle")
       .attr("fill", "black")
       .text(parseInt(d.average))
     })
      .on("mouseout", function()
    {d3.select("#tooltip").remove();
    //d3.selectAll("rect").remove();
    d3.select("#barChart")
      .select("rect")
      .remove()

  })




//make the images update the chart everytime the user hovers over it
var images =
         d3.selectAll('img')
          .on('mouseover',function()
          {
            d3.selectAll(".individual_line")
            .attr("stroke", "none")

            d3.select("#lineChart")
            .attr("class", "small")


             name = parseInt(this.name);
             svg.attr("transform", "scale(0.5) translate(-500,-120)" )
            updateChart(data,gradesByDays,listDays,plotLand,name,xScale,yScale, averagesByDay)
            ;

           })
           .on('mouseout', function(){
             svg.attr("transform", "scale(1) translate(0,0)" )
            d3.selectAll("#barChartAxis")
              .style("opacity", "0")

             d3.selectAll("#studentAvg")
                .attr("stroke", "none")
              d3.selectAll("rect")
                .attr("fill", "none")
           })//location.reload());
          .on("click", function()
          {d3.select("this")
          .attr("transform", "scale(5)")
          d3.selectAll(".line")
            .attr("stroke", "none")
            d3.selectAll("circle")
            .attr("fill", "none")
          penguin=parseInt(this.name)
        fourLines(data, penguin, plotLand, xScale, yScale, height, width)})


//set up legend
var legend = svg.append('g')
                  .classed('legend',true)
                  .attr('transform','translate('+(width+margins.left)+','+margins.top+')');
var legendLines = legend.selectAll('g')
                        .data([0,1, 2, 3, 4])
                        .enter()
                        .append('g')
                        .classed('legendLines',true)
                        .attr('transform', function(d,i)
                        {
                          return "translate(0,"+(i*12)+")";
                        })
legendLines.append('rect')
           .attr('x',0)
           .attr('y',10)
           .attr('width',10)
           .attr('height',10)
           .attr('fill',function(d,i)
           {
            if(i==0)
            {
              return "red";
            }
            else if(i==1)
            {
              return "blue";
            }
            else if (i==2)
            {return "pink"}

            else if(i=3)
            {return "purple"}

            else
            {return "green"}
          })
legendLines.append('text')
           .attr('x',10)
           .attr('y',20)
           .text(function(d,i)
           {
            if(i==0)
            {
              return "Class Average By Day";
            }
            else if (i==1)
            {
              return "Student Average By Day";
            }
            else if (i==2)
            {return "Student Homework Grades"}

            else if(i=3)
            {return "Student Quiz Grades"}

            else
            {return "Student Test Grades"}
                              })
}





//////we want to show how an individuals' moving average over the semester compares width
////the class moving agerave





var updateChart = function(data,gradesByDays,listDays,plotLand,name,xScale,yScale, averagesByDay)
{
  // d3.select("#studentAvg")
  //    .attr("stroke", "none")

gradesByStudent = [];
data.forEach(function(s,i)
{//d is each student
  var student = i;
  var grades = [];
  gradesByDays.forEach(function(g,j)
  {//g is a list grades for everyday
    g.forEach(function(d)
    {//d is a grade object
      if(d.index==data[student].picture)
      {//if d belongs to student
        grades.push(d);
      }})

  })

  gradesByStudent.push(grades);

})

//console.log(gradesByDays,gradesByStudent);
//calculate individual averages
var students = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
var indivStudentGradesByDay = []
listDays.forEach(function(d)
{//d is every grade object

  var days=[];
  gradesByStudent[name].forEach(function(g,j)
  {//g which day
    if(g.day == d)
    {days.push(g);}
  })
  //console.log(days)
  indivStudentGradesByDay.push(days);
})
  var studentAveragesByDay =[];
  indivStudentGradesByDay.forEach(function(d,i)
  {//d is an array containing grades of each day
    var types = 0;
    var hw_total =0;
    var qz_total =0;
    var tt_total=0;
    var fl_total = 0;
    var avg = 0;
    var avg = 0;
    d.forEach(function(g)
    {

    if(g.type=="homework"||g.day==d)
    {
        hw_total=g.grade*2;
    }
    else if(g.type=="quiz"||g.day==d)
    {
        qz_total=g.grade*10;
    }
    else if(g.type=="test"||g.day==d)
    {
        tt_total=g.grade;
    }
    else if(g.type=="final"||g.day==d)
    {
        fl_total=g.grade;
    }})
  if(i==14||i==29)
  {
     avg = tt_total;
  }
  else if(i==40)
  {
     avg = fl_total;
  }
  else if(i%2==1&&i!=29)
  {
     avg = (hw_total+qz_total)/2;
  }
  else
  {
     avg = qz_total;
  }
  var individualAv =
  {
    average: avg,
    day: i+1
  }
  studentAveragesByDay.push(individualAv);

  })


var drawLine = d3.line()
                  .x(function(d,i){
                    return xScale(d.day)})
                    .y(function(d){return yScale(d.average)})
                    .curve(d3.curveCardinal);
plotLand.append('path')
        .datum(studentAveragesByDay)
        .transition().duration(10)
        .attr("id", "studentAvg")
        .attr('class',"line")
        .attr('d',drawLine)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2);

        var width=300
        var height=300
        var barWidth=width/41

        var margins =
        {
          top:50,
          bottom:50,
          left:100,
          right:50
        }

        var yScale=d3.scaleLinear()
                    .domain([0,100])
                             //.domain([0,d3.max(hw, function(d){return d.day;})])
                    .range([height-margins.top-margins.bottom,0]);

        var xScale=d3.scaleLinear()
                  .domain([0,41])
                  .range([0,width-margins.left])

        var barChart= d3.select("#barChart")
                        .attr('width',width)
                        .attr('height',height);
        var plotBar = barChart.append('g')
                              .classed('plot',true)
                              .attr('width',width-margins.left-margins.right)
                              .attr('height',height-margins.top-margins.bottom)
                              .attr("transform", "translate("+margins.left+","+margins.top+")")



        var xAxis2=d3.axisBottom(xScale)
        barChart.append("g")
        .attr("id", "barChartAxis")
        .classed("xAxis", true)
        .call(xAxis2)
        .attr("transform", "translate("+margins.left+","+(height-margins.bottom)+")")


        var yAxis2=d3.axisLeft(yScale)
        barChart.append("g")
        .attr("id", "barChartAxis")
        .classed("yAxis", true)
        .call(yAxis2)
        .attr("transform", "translate("+margins.left+","+margins.top+")")


      plotBar.selectAll("rect")
        .data(studentAveragesByDay)
        .enter()
        .append("rect")
        .attr("x", function(d,i){
          return barWidth*i
        })
        .attr("y", function(d,i){
          return Math.abs(yScale(d.average-(averagesByDay[i].average)))-margins.top-margins.bottom
        })
        .attr("width", barWidth)
        .attr("height", function(d,i){
          var value=Math.abs(yScale(d.average-(averagesByDay[i].average)))

          console.log(height-Math.abs(yScale(d.average-(averagesByDay[i].average))))
          //console.log(d.average,'student average')
        //  console.log(averagesByDay[i].average,'class average')
          return height-Math.abs(yScale(d.average-(averagesByDay[i].average)))
        })
        .attr("fill", function(d,i){
          if (d.average>averagesByDay[i].average)
          {return "blue"}
          else{return "red"}

        })



        //  .attr("y", function(d, i){
        //    return 300-yScale(d.average-(averagesByDay[i].average))
        // })
        // .attr("x", function(d, i){return xScale(i)+80})
        // .attr("height", //yScale(10))
        // function(d,i){
        //   console.log(averagesByDay[i].average, "averagesbyday[i].average")
        //   console.log(d.average, "d.grade")
        //   console.log(d.average-(averagesByDay[i].average))
        //   console.log(yScale(d.average-(averagesByDay[i].average)))
        // return yScale(d.average-(averagesByDay[i].average))})
        // .attr("width", 300/41)
        // .attr("fill", "blue")

}

var fourLines= function(data, penguin, plotLand, xScale, yScale, height, width)
{data[penguin].quizes.forEach(function(d){d.type="Quiz"});
data[penguin].homework.forEach(function(d){d.type="Homework"});
data[penguin].final.forEach(function(d){d.type="Final"});
data[penguin].test.forEach(function(d){d.type="Test"});
var final = data[penguin].final;
var finalAndQuiz = final.concat(data[penguin].quizes);
var quiz=data[penguin].quizes;
var finalQuizHomework=finalAndQuiz.concat(data[penguin].homework);
var homework=data[penguin].homework;
var allGrades=finalQuizHomework.concat(data[penguin].test);
var test=data[penguin].test;
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
  .curve(d3.curveCardinal)


    plotLand.append('path')
      .datum(quiz)
      .transition().duration(1000)
      .attr('class','individual_line')
      .attr('d',quizLine)
      .attr("fill", "none")
      .attr("stroke", "purple")
      .attr("stroke-width", 2)




      var homeworkLine=d3.line()
      .x(function(d){
          return xScale(parseInt(d.day))})
      .y(function(d){
        return yScale(d.homeworkPercent)})
      .curve(d3.curveCardinal)

        plotLand.append('path')
          .datum(homework)
          .transition().duration(1000)
          .attr('class','individual_line')
          .attr('d',homeworkLine)
          .attr("fill", "none")
          .attr("stroke", "hotpink")
          .attr("stroke-width", 2)



          var testLine=d3.line()
          .x(function(d){
              return xScale(parseInt(d.day))})
          .y(function(d){
            return yScale(d.testPercent)})
          .curve(d3.curveCardinal)

            plotLand.append('path')
              .datum(test)
              .transition().duration(1000)
              .attr('class','individual_line')
              .attr('d',testLine)
              .attr("fill", "none")
              .attr("stroke", "green")
              .attr("stroke-width", 2)

              var homeworkLine=d3.line()
              .x(function(d){
                  return xScale(parseInt(d.day))})
              .y(function(d){
                return yScale(d.finalPercent)})
              .curve(d3.curveCardinal)

                plotLand.append('path')
                  .datum(final)
                  .transition().duration(1000)
                  .attr('class','individual_line')
                  .attr('d',finalLine)
                  .attr("fill", "none")
                  .attr("stroke", "green")







                }
