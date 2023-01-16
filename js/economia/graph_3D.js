$(document).ready(function () {

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#graph_3D")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Variables for checking the buttons
    const buttonItaly = document.getElementById("italy")
    const buttonFrance = document.getElementById("france")

    //Read the data
    d3.csv("../../csv/economia/graph_3D.csv",

        // When reading the csv, I must format variables:
        function (d) {
            return { country: d.country, date: d3.timeParse("%d-%m-%Y")(d.date), death: d.death }
        }).then(

            // Now I can use this dataset:
            function (data) {

                // Auxiliary variables for construct the data
                let arrayItaly = [];
                let arrayFrance = [];
                let auxObj = {}

                // Insert in the right array the correspondent data
                for (i = 0; i < data.length; i++) {

                    // Put in array data of Italy
                    if (data[i].country == "italy") {
                        arrayItaly[data[0].country] = data[0].death
                        auxObj = { "date": data[i].date, "death": data[i].death }
                        arrayItaly.push(auxObj)
                    }

                    // Put in array data of France
                    if (data[i].country == "france") {
                        arrayFrance[data[0].country] = data[0].death
                        auxObj = { "date": data[i].date, "death": data[i].death }
                        arrayFrance.push(auxObj)
                    }
                }

                // Draw only axes
                // Add X axis
                const x = d3.scaleTime()
                    .domain(d3.extent(arrayItaly, function (d) { return d.date; }))
                    .range([0, width]);
                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x));

                // Add Y axis
                const y = d3.scaleLinear()
                    .domain([0, d3.max(arrayItaly, function (d) { return +d.death; })])
                    .range([height, 0]);
                svg.append("g")
                    .call(d3.axisLeft(y));

                // Event listener that check when a box is checked
                addEventListener("click", function (e) {

                    // Delete all previous lines including the axes
                    svg.selectAll("path").remove();

                    // Redraw the axes
                    const x = d3.scaleTime()
                        .domain(d3.extent(arrayItaly, function (d) { return d.date; }))
                        .range([0, width]);
                    svg.append("g")
                        .attr("transform", `translate(0, ${height})`)
                        .call(d3.axisBottom(x));
                    const y = d3.scaleLinear()
                        .domain([0, d3.max(arrayItaly, function (d) { return +d.death; })])
                        .range([height, 0]);
                    svg.append("g")
                        .call(d3.axisLeft(y));

                    // Check which button is checked and draw the lines
                    //ITALY
                    if (buttonItaly.checked) {
                        svg.append("path")
                            .datum(arrayItaly)
                            .attr("fill", "none")
                            .attr("stroke", "steelblue")
                            .attr("stroke-width", 1.5)
                            .attr("d", d3.line()
                                .x(function (d) { return x(d.date) })
                                .y(function (d) { return y(d.death) })
                            )
                    }

                    //FRANCE
                    if (buttonFrance.checked) {
                        svg.append("path")
                            .datum(arrayFrance)
                            .attr("fill", "none")
                            .attr("stroke", "red")
                            .attr("stroke-width", 1.5)
                            .attr("d", d3.line()
                                .x(function (d) { return x(d.date) })
                                .y(function (d) { return y(d.death) })
                            )
                    }
                })
            })
})




