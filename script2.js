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

var drawChart = function(data)
{
  document.getElementById("heading")
          .innerHTML="Average Grades Per Day"
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

      else if (i%2==1&&i!=29)
      {avg=((hw_total+qz_total)/2)/23}

      else{avg=qz_total/23}




//haha now we've got an object with the class average for every day
    var classAv =
    {
      average: avg,
      day: i+1
    }

    averagesByDay.push(classAv);
  });
//make the screen
var screen =
{
  width: 1200,
  height: 400
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
            .attr('y',0+margins.left-40)
            .attr('x',0-(height/1.5))
            .text('Average Grade');
var xLabel =svg.append("text")
            .attr('transform','translate('+(width+margins.left)/1.88 + ','+(xA+35)+')' )
            .text('Day');
svg.select('div.students')
    .attr('y',height+30);
//make line
var drawLine = d3.line()
               .x(function(d,i){
                 return xScale(d.day)})
               .y(function(d){return yScale(d.average)})
               //.curve(d3.curveCardinal);

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
     .attr("cx", function(d,i){return xScale(d.day)})
     .attr("cy", function(d){return yScale(d.average)} )
     .attr("r", 5)
     .attr("fill", "red")

     .on("mouseover", function(d, i){

       plotLand.append("text")
       .attr("class", "tooltip")
       .attr("x", xScale(i)+15)
       .attr("y", yScale(d.average)-20)
       .attr("tet-anchor", "middle")
       .attr("fill", "black")
       .text("Day: "+(d.day)+", Class Average: "+(parseInt(d.average)))
     })
      .on("mouseout", function()
    {d3.select(".tooltip").remove();
  })




//make the images update the chart everytime the user hovers over it
var images =
         d3.selectAll('img')
          .on('mouseover',function()
          {
            document.getElementById("heading")
                    .innerHTML="Average Grades Per Day"

            d3.selectAll(".individual_line")
            .attr("stroke", "none")

            d3.select("#lineChart")
            .attr("class", "small")

             name = parseInt(this.name);

            updateChart(data,gradesByDays,listDays,plotLand,name,xScale,yScale, averagesByDay)
            ;

           })
           .on('mouseout', function(){


             d3.selectAll("#studentAvg")
                .attr("stroke", "none")

           })//location.reload());
          .on("click", function()
          {d3.select("#imagesDiv")
            .classed("hidden", true)
          legend.classed("hidden", true)
          d3.selectAll(".line")
            .attr("stroke", "none")
            d3.selectAll("circle")
            .attr("fill", "none")
          penguin=parseInt(this.name)
        fourLines(data, penguin, plotLand, xScale, yScale, height, width, svg, margins)})


//set up legend
var legend = svg.append('g')
                  .classed('legend',true)
                  .attr('transform','translate('+(width+margins.left)+','+margins.top+')');
var legendLines = legend.selectAll('g')
                        .data([0,1])
                        .enter()
                        .append('g')
                        .classed('legendLines',true)
                        .attr('transform', function(d,i)
                        {
                          return "translate(0,"+(i*12)+")";
                        })
legendLines.append('rect')
           .attr('x',0)
           .attr('y',function(d,i){return 10*i})
           .attr('width',12)
           .attr('height',12)
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

          })
legendLines.append('text')
          .attr("id", "legendText")
           .attr('x',15)
           .attr('y',function(d,i){return (10*i)+12})
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

          })
            .attr('id',function(d,i)
          {

             if(i==0)
             {
               return "line1";
             }
             else if (i==1)
             {
               return "line2";
             }
             else if(i==2)
           {
             return "line3"}
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
                    //.curve(d3.curveCardinal);
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
          bottom:100,
          left:100,
          right:50
        }

        var yScale=d3.scaleLinear()
                    .domain([0,100])
                             //.domain([0,d3.max(hw, function(d){return d.day;})])
                    .range([height, 0]);

        var xScale=d3.scaleLinear()
                  .domain([0,41])
                  .range([0,width])

}

var fourLines= function(data, penguin, plotLand, xScale, yScale, height, width, svg, margins)
{
  console.log('fourlines')
  var pic = data[penguin].picture.split('-')
  document.getElementById("heading")
          .innerHTML=pic[0]+" Penguin's Grades"

    d3.selectAll(".legend")
    .selectAll('rect')
    .data([0,1,2])
    .attr("fill",function(d,i){
      if (i==0)
      {return "hotpink"}
      else if(i==1)
      {return "purple"}
      else if(i==2)
      {return "green"}
    })
    d3.selectAll('.legend')
    .selectAll('rect')

    .data([0,1,2])
    .select('text', function(d,i){
      if (i==0)
      {return "Homework"}
      if (i==1)
      {return "Quiz"}
      if (i==2)
      {return "Test"}
    })
    .attr('x',15)
    .attr('y',function(d,i){return (10*i)+12})


//received help manipulating this data from Kristin D. and Daniel B.
data[penguin].quizes.forEach(function(d){d.type="Quiz"});
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

              plotLand.select('#individual_line')
              .on("mouseover", function(d){
                console.log("here")
                d3.select(this)
                .attr("stroke-width", 5)
              })

              var homeworkLine=d3.line()
              .x(function(d){
                  return xScale(parseInt(d.day))})
              .y(function(d){
                return yScale(d.finalPercent)})
              .curve(d3.curveCardinal)

var button = d3.select('button#backButton')
              .classed("hidden", false)
              .on('click',function()
              {
              return location.reload()})

var legend2 = svg.append('g')
                  .classed('legend',true)
                  .attr('transform','translate('+(width+margins.left)+','+margins.top+')');
var legendLines = legend2.selectAll('g')
                          .data([0,1,2])
                          .enter()
                          .append('g')
                          .classed('legendLines',true)
                          .attr('transform', function(d,i)
                              {
                              return "translate(0,"+(i*12)+")";
                                      })
              legendLines.append('rect')
                         .attr('x',0)
                         .attr('y',function(d,i){return 10*i})
                         .attr('width',12)
                         .attr('height',12)
                         .attr('fill',function(d,i)
                         {
                          if(i==0)
                          {
                            return "hotpink";
                          }
                          else if(i==1)
                          {
                            return "purple";
                          }
                          else if(i==2)
                          {return "green"}

                        })
              legendLines.append('text')
                        .attr("id", "legendText")
                         .attr('x',15)
                         .attr('y',function(d,i){return (10*i)+12})
                         .text(function(d,i)
                         {
                          if(i==0)
                          {
                            return "Homework";
                          }
                          else if (i==1)
                          {
                            return "Quizzes";
                          }
                          else if(i==2)
                          {return "Tests"}

                        })


                }
