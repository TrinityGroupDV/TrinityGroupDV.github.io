$(document).ready(function () {


    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 20, bottom: 30, left: 50 },
        width = 750 - margin.left - margin.right,
        height = 460 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#graph_1B")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv").then(function (data) {

        // Add X axis
        const x = d3.scaleLinear()
            .domain([0, 10000])
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([35, 90])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add a scale for bubble size
        const z = d3.scaleLinear()
            .domain([200000, 1310000000])
            .range([1, 40]);

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .join("circle")
            .attr("cx", d => x(d.gdpPercap))
            .attr("cy", d => y(d.lifeExp))
            .attr("r", d => z(d.pop))
            .style("fill", "#69b3a2")
            .style("opacity", "0.7")
            .attr("stroke", "black")

    })
})




