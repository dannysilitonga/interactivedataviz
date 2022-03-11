/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
      height = window.innerHeight * 0.7,
      margin = { top: 20, bottom: 50, left: 60, right:40};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/stateCapitals.csv", d3.autoType),
]).then(([geojson, capitals]) => {

  const svg = d3
    .select("#container")
    .append("svg")
    .attr("width", "width")
    .attr("height", height);
  
  // SPECIFY PROJECTION
  const projection = d3.geoAlbersUsa()
    .fitSize([
      width-margin.left-margin.right,
      height-margin.top-margin.bottom
    ], geojson);
 
  // DEFINE PATH FUNCTION
  const path = d3.geoPath(projection)
  
  //draw base layer path - one path for each state
  const states = svg.selectAll("path.states")
    .data(geojson.features)
    .join("path")
    .attr("class", 'states')
    .attr("stroke", "black")
    .attr("fill", "transparent")
    .attr("d", path)

  // draw point for the graduate center
    const gradCenterPoint = { latitude: 40.7423, longitude: -73.9833 };
  svg.selectAll("circle.point")
    .data([gradCenterPoint])
    .join("circle")
    .attr("r", 10)
    .attr("fill", "gold")
    .attr("transform", d=> {
      const [x, y] = projection([d.longitude, d.latitude])
      return `'translate(${x}, ${y})`
    })

  // draw point for all state capitals 
  svg.selectAll("circle.capital")
    .data(capitals)
    .join("circle")
    .attr("r", 5)
    .attr("fill", "lightsalmon")
    .attr("transform", d => {
      const [x, y] = projection([d.longitude, d.latitude])
      return `translate(${x}, ${y})`
    })



  // APPEND GEOJSON PATH  
    
  // APPEND DATA AS SHAPE

});