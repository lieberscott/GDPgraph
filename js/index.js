document.addEventListener("DOMContentLoaded",function(){
  req=new XMLHttpRequest();
  req.open("GET",'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',true);
  req.send();
  req.onload=function(){
    const dataset=JSON.parse(req.responseText);
    const da = dataset.data;
    const w = 900;
    const h = 600;
    const padding = 60;
    
    const svg = d3.select(".flex-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
        
    const xScale = d3.scaleTime()
    .domain([new Date(1947, 0, 1), new Date(2015, 6, 1)])
    .range([padding, w-18]); // hacky
        
    const yScale = d3.scaleLinear()
    .domain([0, d3.max(da, (d) => d[1])])
    .range([h - padding, padding]);
      
    let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");
        
    const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

    // So numbers on tooltip will display $9,000 rather than $9000
    const format = d3.format(",");        
    
    svg.selectAll("rect")
       .data(da)
       .enter()
       .append("rect")
       .attr("x", (d, i) => padding + i * 3)
       .attr("y", (d, i) => yScale(d[1]))
       .attr("width", 2)
       .attr("height", (d, i) => h - padding - yScale(d[1]))
       .attr("class", "bar")
       .on("mousemove", (d) => {
         let date = new Date(d[0]);
         let year = date.getFullYear();
         let month = date.getMonth();
         let num = format(parseInt(d[1]));
           tooltip
             .style("left", d3.event.pageX - 50 +"px")
             .style("top", d3.event.pageY - 70 + "px")
             .style("display", "inline-block")
             .html("<span><strong>" + months[month] + " " + year + "</strong><br/>$" + num + " Billion</span>")
       })
        .on("mouseout", (d) => {
           tooltip
             .style("display", "none");
        });
        
    const xAxis = d3.axisBottom(xScale);
    
    svg.append("g")
       .attr("transform", "translate(0," + (h - padding) + ")")
       .call(xAxis);
    
    const yAxis = d3.axisLeft(yScale);
    
    svg.append("g")
       .attr("transform", "translate(" + padding + ", 0)")
       .call(yAxis);
    };
  });