/* CONSTANTS AND GLOBALS */

const margin = {top: 20, right:30, bottom:40, left:180},
  width = window.innerWidth*0.9 - margin.left - margin.right,
  height = window.innerHeight*0.9 - margin.top - margin.bottom;



// // since we use our scales in multiple functions, they need global scope
let xScale, yScale;

/* APPLICATION STATE */
let state = {
  data: [],
};

let jobsByAgency = []

let jobOpenings = []

url = "https://data.cityofnewyork.us/resource/kpav-sd4t.json"

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
  let results = [];
  for (let i =0; i < agency.length; i++){
    results.push({
      agency: agency[i],
      count: count[i]
    });
  }
  return results;
};

const svg = d3.select("#container")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


/* LOAD DATA */
d3.json(url).then(raw_data => {
  console.log("data", raw_data);
  
  jobsByAgency = groupBy(raw_data, 'agency')
  
  let countJobs = []; 

  for (i in jobsByAgency){
    countJobs.push(jobsByAgency[i].length)
  }
  
  let agencies = Object.keys(jobsByAgency)
  jobOpenings = combineArray(agencies,countJobs)
  jobOpenings = jobOpenings.sort((a,b) => (a.count < b.count) ? 1: -1)

  const startIndex = 0;
  const endIndex = 55;
  jobOpeningsSubset = jobOpenings.slice([startIndex], [endIndex])

  // save our data to application state
  state.data = jobOpeningsSubset

  
  console.log(state.data);

  

  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  /* SCALES */
  // xscale - categorical, activity
  const xScale = d3.scaleLinear()
      .domain([0, d3.max(state.data, d=> d.count)])   //data.map(d=> d.activity))
      .range([0, width]); //visual variable
      //.ticks(5); 

  svg.append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(xScale).ticks(10))
      .selectAll("text")
      .attr("transform", "translate(0,0)rotate(0)")
      .style("text-anchor", "end")
      .style("color","#708090");

    //yscale - linear, count
  const yScale = d3.scaleBand()
      .domain(state.data.map(d=> d.agency))
      .range([0, height])
      .paddingInner(0.15);

  svg.append("g")
      .call(d3.axisLeft(yScale))
      .style("font-size",10)
      .style("color","#708090")
      .attr("font-family", "Source Sans Pro");
    

  svg.selectAll("rect")
      .data(state.data)
      .join("rect")
      .attr("x", xScale(0))
      .attr("y", function(d) { return yScale(d.agency); })
      .attr("height",  yScale.bandwidth() ) // d=> height - yScale(d.count))
      .attr("fill", "#69b3a2")
      .transition()
      .duration(1000)
      .attr("width", "0")
      .transition()
      .duration(1500)
      .attr("width", "1600")
      .transition(1500)   
      .attr("width", function(d) { return xScale(d.count); }) //)
      
      //.transition()
      //.duration(2000)
      //.attr("width", "400")
      //.transition()
      //.duration(2000)
      //.attr("width", function(d) { return xScale(d.count); })
      //.attr("x", d=>xScale(d.activity))
      //.attr("y", d=>yScale(d.count))
    /** Select your container and append the visual elements to it */

  }    

 
  //xScale = d3.scaleBand()
  //  .domain(state.data.map(d=> d.agency))
  //  .range([0, width]) // visual variable
  //  .paddingInner(.2)

  //yscale - linear, count
//  yScale = d3.scaleLinear()
 //   .domain([20, d3.max(state.data, d=> d.count)])
 //   .range([height, 0])


//  draw(); // calls the draw function
//}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
// function draw() {
//   /* HTML ELEMENTS */
//   //svg
//   const svg = d3.select("#container")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");

//   // axis scales
//   const xAxis = d3.axisBottom(xScale)
//     svg.append("g")
//     .attr("transform", `translate(0, ${height})`)
//     .call(xAxis)
//     .selectAll("text")
//     .attr("transform", "translate(0,0)rotate(0)")
//     .style("font-size",8);

//   const yAxis = d3.axisLeft(yScale).ticks(5)
//   svg.append("g")
//     .attr("transform", `translate(${margin.left - 100}, 0)`)
//     .call(yAxis);
  
//     // bars
//     svg.selectAll("rect")
//       .data(state.data)
//       .join("rect")
//       .attr("width", xScale.bandwidth())
//       .attr("height", d=> height - yScale(d.count))
//       .attr("x", d=>xScale(d.agency))
//       .attr("y", d=>yScale(d.count))
//       .attr("fill", "#69b3a2")
// }