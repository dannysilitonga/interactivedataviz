/* CONSTANTS AND GLOBALS */

const margin = {top: 20, right:30, bottom:40, left:180},
  width = window.innerWidth*0.9 - margin.left - margin.right,
  height = window.innerHeight*0.9 - margin.top - margin.bottom;

// // since we use our scales in multiple functions, they need global scope
let xScale, yScale;
/* APPLICATION STATE */
let state = {
  data: [],
  // hover: null
  selection: "all"
};
let jobsByAgency = [];
let jobOpenings = [];
let countJobs = [];
const raw_data_output = {
  data: []
};
let subsetData = [];
const salaryMin = 125000;
const uniqueIds = [];

url = "https://data.cityofnewyork.us/resource/kpav-sd4t.json?$limit=5000"

const groupBy = (array, key) => {
  //return the end result
  return array.reduce((result, currentValue) => {
    //If an aray already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the curren iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
    }, {}); //empty object is the initial value for result object 
};

const combineArray = (agency = [], count = []) => {
  let newData = [];
  for (let i =0; i < agency.length; i++){
    newData.push({
      agency: agency[i],
      count: count[i]
    });
  }
  return newData;
};

const container = d3.select("#container")
  .style("position", "relative");

const svg = container
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)  
  .style("position", "relative")
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
  ;

tooltip = d3.select("body")
  .append("div") 
  .attr("Class", "tooltip")
  .style("z-index", "10")
  .style("position", "absolute")
  .style("visibility", "hidden")
  .style("opacity", 0.8)
  .style("padding", "2px")
  .style("font-size",'12px')
  .attr("fill", "#69b3a2")
  .text("tooltip");

/* LOAD DATA */
d3.json(url).then(raw_data => {
  console.log("data", raw_data);
  console.log(raw_data.length)

  // save raw data for debugging and other purposes
  raw_data_output.data = raw_data
  
  //remove duplicate data
  subsetData = Array.from(new Set(raw_data_output.data.map( o => JSON.stringify(o))), s => JSON.parse(s));
  console.log(subsetData)
  console.log(subsetData.length)

  //group the data by city agency
  jobsByAgency = groupBy(subsetData, 'agency')

  // filter data to include salary requirement and remove duplicates, external and internal
  // count the number of jobs 
  let count = 0;  
  for(j in jobsByAgency){
    for(var i =0; i<jobsByAgency[j].length; i++){
        if((parseInt(jobsByAgency[j][i]['salary_range_to']) > salaryMin) &&
          (jobsByAgency[j][i]['posting_type'] == "External")) {
            count = count + parseInt(jobsByAgency[j][i]['number_of_positions'])
        }
    }
    countJobs.push(count)
    //reset count to zero
    count = 0;
    //countUpdated = 0;    
}
  
 // create array of city agencies  
  let agencies = Object.keys(jobsByAgency)
  // combine the count of jobs 
  jobOpenings = combineArray(agencies,countJobs)
  jobOpenings = jobOpenings.sort((a,b) => (a.count < b.count) ? 1: -1)

  
  // save our data to application state
  state.data = jobOpenings

  
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  /* SCALES */
  // xscale - categorical, activity
  const xScale = d3.scaleLinear()
      .domain([0, d3.max(state.data, d=> d.count+5)])   //data.map(d=> d.activity))
      .range([0, width]); //visual variable
      //.ticks(5); 

  svg.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(xScale).ticks(10))
      .selectAll("text")
      .attr("transform", "translate(0,0)rotate(0)")
      .style("text-anchor", "end")
      .style("color","#708090")
      .attr("font-family", "Source Sans Pro");

  svg.append("text")
      .attr("x", width / 2 )
      .attr("y",  height + margin.bottom-5)
      .style("text-anchor", "middle")
      .text("Number of Job Postings Paying at least $125,000")
      .style("color","#708090")
      .attr("font-family", "Source Sans Pro")
      .style("font-size",12);

    //yscale - linear, count
  const yScale = d3.scaleBand()
      .domain(state.data.map(d=> d.agency))
      .range([0, height])
      .paddingInner(0.2);

  svg.append("g")
      .call(d3.axisLeft(yScale))
      .style("font-size",10)
      .style("color","#708090")
      .attr("font-family", "Source Sans Pro");
    

  var dots = svg.selectAll("rect")
      .data(state.data)
      .join("rect")
      .attr("x", xScale(0))
      .attr("y", function(d) { return yScale(d.agency); })
      .attr("height",  yScale.bandwidth() ) // d=> height - yScale(d.count))
      .attr("fill", "#69b3a2");
     
     
  dots.transition()
      .duration(1000)
      .attr("width", "0")
      .transition()
      .duration(1500)
      .attr("width", "1600")
      .transition(1500)   
      .attr("width", function(d) { return xScale(d.count); }); //)
      
  dots.on("mouseover", function(event,d,i) {
          tooltip
            .html(`<div>Number of Job Postings: ${d.count}</div>`)
            .style("visibility", "visible")
            .style("opacity", .8)
            
            
            .style("background", "#FFDEAD")
        })
        .on("mousemove", function (event) { 
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function(event, d){
          tooltip
            .html(``)
            .style("visibility", "hidden");
        })      

}

function draw() {
   /* HTML ELEMENTS */
  // svg
}
     