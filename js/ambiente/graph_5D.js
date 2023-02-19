$(document).ready(function () {

    let aux = 0;
    draw()

    addEventListener("resize", (event) => {
        draw()
    })

    function draw() {

        let clientHeight = document.getElementById('graph_5D').clientHeight - 60;
        let clientWidth = document.getElementById('graph_5D').clientWidth - 100;

        // Set margin
        const margin = { top: 10, right: 20, bottom: 50, left: 60 };
        if (aux == 1) {
            $("#graph_5D").empty();
        }
        aux = 1;

        // Append the svg object to the body of the page
        const svg = d3.select("#graph_5D")
            .append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        //Read the data
        d3.csv("../../csv/ambiente/graph_5D.csv",

            // When reading the csv, I must format variables:
            function (d) {
                return { date: d3.timeParse("%Y")(d.TIME_PERIOD), value: d.OBS_VALUE }
            }).then(

                // Now I can use this dataset:
                function (data) {

                    // Add X axis --> it is a date format
                    const x = d3.scaleTime()
                        .domain(d3.extent(data, function (d) { return d.date; }))
                        .range([0, clientWidth]);
                    svg.append("g")
                        .attr("transform", `translate(0, ${clientHeight})`)
                        .call(d3.axisBottom(x));

                    // Add Y axis
                    const y = d3.scaleLinear()
                        .domain([7, 10])
                        .range([clientHeight, 0]);
                    svg.append("g")
                        .call(d3.axisLeft(y));

                    // Add the line
                    svg.append("path")
                        .datum(data)
                        .attr("fill", "none")
                        .attr("stroke", "#4f4f4f")
                        .attr("stroke-width", 1.5)
                        .attr("d", d3.line()
                            .x(function (d) { return x(d.date) })
                            .y(function (d) { return y(d.value) })
                        )
                    svg.append("text")
                        .attr("class", "legend5C")
                        .attr("x", "-145")
                        .attr("y", 180)
                        .text("Tonnes per capita")
                        .style("font-size", "100%")
                        .attr('transform', 'rotate(270 ' + -60 + ' ' + 160 + ')')
                        .attr("alignment-baseline", "middle")
                    svg.append("text")
                        .attr("class", "legend5C")
                        .attr("x", "40%")
                        .attr("y", 430)
                        .text("Date")
                        .style("font-size", "100%")
                        .attr("alignment-baseline", "middle")
                })
    }
})



