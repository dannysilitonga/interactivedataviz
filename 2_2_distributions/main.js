/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right:40 },
  radius = 5;
/* LOAD DATA */
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv", d3.autoType).then (data => {

  for(i=0; i < data.length; i++){
    data[i]["Category"] = (data[i]["SalePrice"] > 250000) ? "true" : "false"
  }

  //data["category"] = (data.map((d) => ["SalePrice"] > 400000) ? "true" : "false")
//d3.json('../data/environmentRatings.json', d3.autoType).then(data => {
    console.log("data", data)
    //console.log(data["Category"])

    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data.map(d => d.GrLivArea))])
      .range([margin.left, width - margin.right])

    // yscale - linear, count 
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.SalePrice)])
      .range([height - margin.bottom, margin.top])

    const colorScale = d3.scaleOrdinal()
      .domain(data.map((d) => d["Category"]))
      .range(["red", "purple"])

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
    //svg
    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    // axis scales
    const xAxis = d3.axisBottom(xScale)
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale)
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    //circles       
    svg
      .selectAll("circle")
      .data(data) 
      .join(
        enter => enter
          .append("circle")
          .attr("r", 1)
          .attr("cx", d => xScale(d.GrLivArea))
          .attr("cy", d => yScale(d.SalePrice))
          //.attr("r", radius)
          .attr("fill", "red")
            .transition()
            .duration(4000) // in ms
            .delay(200)
            .attr("r", 5)
            .attr("fill", d=> colorScale( d.Category ))
      )

  });